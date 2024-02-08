import hre from 'hardhat';
import { RMRK_MINTER_ADDRESS } from './consts/kanaria-contracts.js';
import { ITEM_BATCH_MINTER_ADDRESS } from './consts/rmrk-contracts.js';
import invariant from 'tiny-invariant';
import { Address, getAddress } from 'viem';
import { ItemsBatchMinter } from '../abis/ItemsBatchMinter.js';
import { getOrCreateNdjosnLogFile } from './utils/get-or-create-ndjosn-log-file.js';
import fs from 'fs';
import { jsonStringifyWithBigint } from './utils/json-stringify-with-bigint.js';
import { chunkArray } from './utils/utils.js';

export type NestMintWithAssetInputData = {
  assetId: bigint;
  collectionAddress: Address;
  destinationCollectionAddress: Address;
  destinationTokenIds: bigint[];
};

type LogEntry = Record<
  string,
  { inputData: NestMintWithAssetInputData; hash: Address }
>;

export const mintMigrationRewardNfts = async (
  nestMintWithAssetsInputDataArray: NestMintWithAssetInputData[],
) => {
  const network = hre.network.name;
  const logFilePath = `${process.cwd()}/scripts/script-results-logs/all-your-base/minted-batches-${network}.ndjson`;
  const [kanariaMinterWalletClient] = await hre.viem.getWalletClients();
  const publicClient = await hre.viem.getPublicClient();

  if (
    getAddress(kanariaMinterWalletClient.account.address) !==
    getAddress(RMRK_MINTER_ADDRESS)
  ) {
    console.warn('Wallet is not the Kanaria Minter', {
      kanariaMinterWalletClientAddress:
        kanariaMinterWalletClient.account.address,
      RMRK_MINTER_ADDRESS,
    });
    throw new Error('Wallet is not the Kanaria Minter');
  }

  const itemsBatchMinterAddress =
    ITEM_BATCH_MINTER_ADDRESS[
      hre.network.config.chainId as keyof typeof ITEM_BATCH_MINTER_ADDRESS
    ];
  invariant(
    itemsBatchMinterAddress,
    'No items batch minter address for this network',
  );

  // Get existing minted batches logs, or create the file if it doesn't exist
  const alreadyMintedBatches =
    await getOrCreateNdjosnLogFile<LogEntry>(logFilePath);

  for (const nestMintWithAssetInputData of nestMintWithAssetsInputDataArray) {
    const {
      assetId,
      collectionAddress,
      destinationCollectionAddress,
      destinationTokenIds,
    } = nestMintWithAssetInputData;

    const chunks = chunkArray(destinationTokenIds, 10);

    for (const [chunkIndex, destinationTokenIdsChunk] of chunks.entries()) {
      const uniqueLogIdentifier = `${collectionAddress}-${destinationCollectionAddress}-${assetId.toString()}-chunkIndex${chunkIndex}`;

      // Check if this batch has already been minted
      if (alreadyMintedBatches.find((batch) => !!batch[uniqueLogIdentifier])) {
        console.warn(`Already minted batch ${uniqueLogIdentifier}. Skipping`, {
          nestMintWithAssetInputData: {
            assetId,
            collectionAddress,
            destinationCollectionAddress,
            destinationTokenIds: destinationTokenIdsChunk,
          },
        });
        continue;
      }

      console.log('Batch Nest minting NFTs with asset', {
        nestMintWithAssetInputData,
      });

      const { request } = await publicClient.simulateContract({
        abi: ItemsBatchMinter,
        address: itemsBatchMinterAddress,
        functionName: 'batchNestMintTokensWithExistingAsset',
        args: [
          collectionAddress,
          destinationCollectionAddress,
          destinationTokenIdsChunk,
          assetId,
        ],
      });

      console.log('Sending transaction');
      const hash = await kanariaMinterWalletClient.writeContract(request);
      console.log('Waiting for transaction receipt for hash', hash);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log('Transaction success', hash);

      const logEntry: LogEntry = {
        [uniqueLogIdentifier]: {
          inputData: {
            assetId,
            collectionAddress,
            destinationCollectionAddress,
            destinationTokenIds: destinationTokenIdsChunk,
          },
          hash,
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
