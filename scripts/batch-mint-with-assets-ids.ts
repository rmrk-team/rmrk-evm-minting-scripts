import hre from 'hardhat';
import { Address, decodeEventLog } from 'viem';
import { getOrCreateNdjosnLogFile } from './utils/get-or-create-ndjosn-log-file.js';
import { chunkArray } from './utils/utils.js';
import { KanariaItems } from '../abis/KanariaItems.js';
import invariant from 'tiny-invariant';
import fs from 'fs';
import { jsonStringifyWithBigint } from './utils/json-stringify-with-bigint.js';

export type BatchMintWithAssetsIdsInputData = {
  contractAddress: Address;
  assetIds: bigint[][];
  to: Address;
};

type LogEntry = Record<
  string,
  {
    inputData: BatchMintWithAssetsIdsInputData;
    hash: Address;
    tokenIds: bigint[];
  }
>;

export const batchMintWithAssetsIds = async (
  batchMintWithAssetsIdsInputDataArray: BatchMintWithAssetsIdsInputData[],
  logFilePath: string,
) => {
  const [walletClient] = await hre.viem.getWalletClients();
  const publicClient = await hre.viem.getPublicClient();

  // Get existing minted batches logs, or create the file if it doesn't exist
  const alreadyMintedBatches =
    await getOrCreateNdjosnLogFile<LogEntry>(logFilePath);

  for (const batchMintWithAssetsIdsInputData of batchMintWithAssetsIdsInputDataArray) {
    const { contractAddress, to, assetIds } = batchMintWithAssetsIdsInputData;

    const assetIdsChunks = chunkArray(assetIds, 25);

    console.log('Total chunks split by 50', {
      assetIdsChunksLength: assetIdsChunks.length,
    });

    for (const [
      chunkIndex,
      destinationTokenIdsChunk,
    ] of assetIdsChunks.entries()) {
      console.log(`Processing chunk ${chunkIndex} of ${assetIdsChunks.length}`);
      const uniqueLogIdentifier = `${contractAddress}-${assetIds[0][0].toString()}-${assetIds[
        assetIds.length - 1
      ][0].toString()}-${to}-chunkIndex${chunkIndex}`;

      // Check if this batch has already been minted
      if (alreadyMintedBatches.find((batch) => !!batch[uniqueLogIdentifier])) {
        console.warn(
          `Log for this identifier already exists ${uniqueLogIdentifier}. Skipping`,
          {
            batchMintWithAssetsIdsInputData: {
              contractAddress,
              to,
              assetIds: destinationTokenIdsChunk,
            },
          },
        );
        continue;
      }

      console.log('Simulating contract call', {
        batchMintWithAssetsIdsInputData: {
          contractAddress,
          to,
          assetIds: destinationTokenIdsChunk,
        },
      });

      const { request } = await publicClient.simulateContract({
        abi: KanariaItems,
        address: contractAddress,
        functionName: 'batchMintWithAssets',
        args: [to, destinationTokenIdsChunk],
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
            eventName: 'Transfer',
            abi: KanariaItems,
            strict: false,
          });
        } catch (e) {
          return null;
        }
      });

      const tokenIds = events
        .filter((event) => event !== null)
        .filter((event) => event?.eventName === 'Transfer')
        .map((event) => {
          if (event?.args?.tokenId) {
            return event.args.tokenId;
          }
          console.error('Token ID is not present on event log', event);
          throw new Error('Token ID is not present on event log');
        });

      invariant(tokenIds, 'Token IDs are not present on event log');

      const logEntry: LogEntry = {
        [uniqueLogIdentifier]: {
          inputData: {
            contractAddress,
            to,
            assetIds: destinationTokenIdsChunk,
          },
          hash,
          tokenIds,
        },
      };

      await fs.promises.appendFile(
        logFilePath,
        `${jsonStringifyWithBigint(logEntry)}\n`,
      );
    }
  }

  console.log('All done');
};
