import { Address, decodeEventLog } from 'viem';
import hre from 'hardhat';
import { RMRKEquippableImpl } from '@rmrk-team/rmrk-evm-utils';
import { getOrCreateNdjosnLogFile } from './utils/get-or-create-ndjosn-log-file.js';
import fs from 'fs';
import { jsonStringifyWithBigint } from './utils/json-stringify-with-bigint.js';
import invariant from 'tiny-invariant';

export type AddEquippableAssetEntriesInputData = {
  contractAddress: Address;
  equippableAssetEntryFields: {
    equippableGroupId: bigint;
    catalogAddress: Address;
    metadataURI: string;
    partIds: bigint[];
  };
};

type LogEntry = Record<
  string,
  {
    inputData: AddEquippableAssetEntriesInputData;
    hash: Address;
    assetId: bigint;
  }
>;

export const addEquippableAssetEntries = async (
  addEquippableAssetEntriesInputDataArray: AddEquippableAssetEntriesInputData[],
  logFilePath: string,
) => {
  const [walletClient] = await hre.viem.getWalletClients();
  const publicClient = await hre.viem.getPublicClient();

  // Get existing minted batches logs, or create the file if it doesn't exist
  const alreadyMintedBatches =
    await getOrCreateNdjosnLogFile<LogEntry>(logFilePath);

  for (const addEquippableAssetEntriesInputData of addEquippableAssetEntriesInputDataArray) {
    const {
      contractAddress,
      equippableAssetEntryFields: {
        equippableGroupId,
        catalogAddress,
        metadataURI,
        partIds,
      },
    } = addEquippableAssetEntriesInputData;

    const uniqueLogIdentifier = `${contractAddress}-${equippableGroupId.toString()}-${catalogAddress}-${metadataURI}`;

    // Check if this batch has already been minted
    if (alreadyMintedBatches.find((batch) => !!batch[uniqueLogIdentifier])) {
      console.warn(`Already added asset ${uniqueLogIdentifier}. Skipping`, {
        addEquippableAssetEntriesInputData,
      });
      continue;
    }

    console.log('Simulating contract call', {
      addEquippableAssetEntriesInputData,
    });
    const { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi: RMRKEquippableImpl,
      functionName: 'addEquippableAssetEntry',
      args: [equippableGroupId, catalogAddress, metadataURI, partIds],
    });

    console.log('Sending transaction');
    const hash = await walletClient.writeContract(request);
    console.log('Waiting for transaction receipt for hash', hash);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log('Transaction success', hash);

    const events = receipt.logs.map((log) => {
      try {
        return decodeEventLog({
          data: log.data,
          topics: log.topics,
          eventName: 'AssetSet',
          abi: RMRKEquippableImpl,
          strict: false,
        });
      } catch (e) {
        return null;
      }
    });

    const assetId = events
      .filter((event) => event !== null)
      .find((event) => event?.eventName === 'AssetSet')?.args.assetId;

    invariant(assetId, 'Asset ID is not present on event log');

    console.log('Added asset entry with id', assetId.toString());

    const logEntry: LogEntry = {
      [uniqueLogIdentifier]: {
        inputData: addEquippableAssetEntriesInputData,
        hash,
        assetId,
      },
    };

    await fs.promises.appendFile(
      logFilePath,
      `${jsonStringifyWithBigint(logEntry)}\n`,
    );
  }
};
