import { pinMetadataFromFiles } from './pin-metadata-from-files.js';
import { kanariaAllYourBaseMetadatas } from './input-data/all-your-base/kanaria-all-your-base-metadatas.js';
import {
  mintMigrationRewardNfts,
  NestMintWithAssetInputData,
} from './mint-migration-reward-nfts.js';
import {
  KANARIA_BIRD_CONTRACT,
  KANARIA_CATALOG_CONTRACT,
  KANARIA_ITEMS_CONTRACTS,
  RMRK_MINTER_ADDRESS,
} from './consts/kanaria-contracts.js';
import hre from 'hardhat';
import invariant from 'tiny-invariant';
import { kanariaBirdMigratedIdsSnapshot } from './input-data/all-your-base/kanaria-bird-migrated-ids-snapshot.js';
import { kanariaBirdsSalesIdsSnapshot } from './input-data/all-your-base/kanaria-birds-sales-ids-snapshot.js';
import {
  addEquippableAssetEntries,
  AddEquippableAssetEntriesInputData,
} from './add-equippable-asset-entries.js';
import { mapSlotToEquippableGroupId } from './consts/kanaria-catalog-parts.js';
import {
  batchMintWithAssetsIds,
  BatchMintWithAssetsIdsInputData,
} from './batch-mint-with-assets-ids.js';

/**
 * TODO list
 * 1. Run manageContributorEntry to add ItemBatchMinter as a contributor to all Kanaria items contracts
 * 2. Pin all metadata if not pinned yet (check logs if it's already pinned, no need to repin for different network)
 * 3. Add asset entries by running addAllYourBaseEquippableAssetEntries. Make sure ipfs CIDs are correct (check step 2 above)
 * 4. Nest mint all NFTs that needs to be nested on Kanarias by running mintMigrationRewardNFTsEntry. Make sure assetId is updated from logs of step 3.
 * 5. Mint remaining NFTs to RMRK_MINTER_ADDRESS by running batchMintAllYourBaseNFTsWithAssetToAccount. Make sure assetId us updated from logs of step 3.
 */

const FOREGROUND_ASSET_ID = BigInt(33);
const BACKGROUND_ASSET_ID = BigInt(34);
const HEADWEAR_ASSET_ID = BigInt(35);

const pinMetadatas = async () => {
  await pinMetadataFromFiles(
    kanariaAllYourBaseMetadatas,
    'scripts/script-results-logs/all-your-base/all-your-base-metadata-pinning-logs.json',
    process.env.FILEBASE_BUCKET_KANARIA,
  );
};

const mintMigrationRewardNFTsEntry = async () => {
  const chainId = hre.network.config.chainId;
  invariant(chainId, 'Chain ID is not defined');

  const kanariaItemContracts =
    KANARIA_ITEMS_CONTRACTS[chainId as keyof typeof KANARIA_ITEMS_CONTRACTS];

  const kanariaContract =
    KANARIA_BIRD_CONTRACT[chainId as keyof typeof KANARIA_BIRD_CONTRACT];

  const migratedSnapshotKanariaIds = kanariaBirdMigratedIdsSnapshot.map((obj) =>
    BigInt(obj.id.split(':')[2]),
  );
  const tradedSnapshotKanariaIds = kanariaBirdsSalesIdsSnapshot.map((obj) =>
    BigInt(obj.id.split(':')[2]),
  );

  const nestMintWithAssetInputDataArray: NestMintWithAssetInputData[] = [
    {
      // Foreground NFT
      assetId: FOREGROUND_ASSET_ID,
      collectionAddress: kanariaItemContracts.KANCHAMP,
      destinationCollectionAddress: kanariaContract,
      destinationTokenIds: migratedSnapshotKanariaIds,
    },
    {
      // Background NFT
      assetId: BACKGROUND_ASSET_ID,
      collectionAddress: kanariaItemContracts.KANCHAMP,
      destinationCollectionAddress: kanariaContract,
      destinationTokenIds: tradedSnapshotKanariaIds,
    },
    // TODO: If we want to reward Headwear then uncomment it, but we will probably mint them to RMRK minter account and distribute later
    // {
    // // Headwear NFT
    //   assetId: HEADWEAR_ASSET_ID,
    //   collectionAddress: kanariaItemContracts.KANCHAMP,
    //   destinationCollectionAddress: kanariaContract,
    //   destinationTokenIds: tradedSnapshotKanariaIds,
    // },
  ];

  await mintMigrationRewardNfts(nestMintWithAssetInputDataArray);
};

const addAllYourBaseEquippableAssetEntries = async () => {
  const network = hre.network.name;
  const chainId = hre.network.config.chainId;
  invariant(chainId, 'Chain ID is not defined');
  const logFilePath = `${process.cwd()}/scripts/script-results-logs/all-your-base/all-your-base-equippable-assets-entries-${network}.ndjson`;

  const kanariaItemContracts =
    KANARIA_ITEMS_CONTRACTS[chainId as keyof typeof KANARIA_ITEMS_CONTRACTS];
  const kanariaCatalogAddress =
    KANARIA_CATALOG_CONTRACT[chainId as keyof typeof KANARIA_CATALOG_CONTRACT];

  const inputData: AddEquippableAssetEntriesInputData[] = [
    {
      contractAddress: kanariaItemContracts.KANCHAMP,
      equippableAssetEntryFields: {
        equippableGroupId: BigInt(mapSlotToEquippableGroupId.foreground),
        catalogAddress: kanariaCatalogAddress,
        metadataURI: 'ipfs://QmXaU5G4MxD74t28eGo4nsWr4XuZnrb5CGMN5GGkvSCHoe',
        partIds: [],
      },
    },
    {
      contractAddress: kanariaItemContracts.KANCHAMP,
      equippableAssetEntryFields: {
        equippableGroupId: BigInt(mapSlotToEquippableGroupId.background),
        catalogAddress: kanariaCatalogAddress,
        metadataURI: 'ipfs://QmNtuB451ykPgyxk7GReSnmDrvSxWTpXkLEgAFhDPTo2bG',
        partIds: [],
      },
    },
    {
      contractAddress: kanariaItemContracts.KANCHAMP,
      equippableAssetEntryFields: {
        equippableGroupId: BigInt(mapSlotToEquippableGroupId.headwear),
        catalogAddress: kanariaCatalogAddress,
        metadataURI: 'ipfs://QmYfnEoqYko7HgySiwtW3y91iUprnuYuFumJjAzJJ9jweE',
        partIds: [],
      },
    },
  ];
  await addEquippableAssetEntries(inputData, logFilePath);
};

const batchMintAllYourBaseNFTsWithAssetToAccount = async () => {
  const network = hre.network.name;
  const chainId = hre.network.config.chainId;
  invariant(chainId, 'Chain ID is not defined');
  const logFilePath = `${process.cwd()}/scripts/script-results-logs/all-your-base/all-your-base-batch-mint-to-account-${network}.ndjson`;

  const kanariaItemContracts =
    KANARIA_ITEMS_CONTRACTS[chainId as keyof typeof KANARIA_ITEMS_CONTRACTS];

  const totalNftsHeadwear = 250;
  const totalNftsBackground = 250 - kanariaBirdsSalesIdsSnapshot.length;

  const inputDataArray: BatchMintWithAssetsIdsInputData[] = [
    {
      contractAddress: kanariaItemContracts.KANCHAMP,
      assetIds: new Array(totalNftsHeadwear).fill([HEADWEAR_ASSET_ID]),
      to: RMRK_MINTER_ADDRESS,
    },
    {
      contractAddress: kanariaItemContracts.KANCHAMP,
      assetIds: new Array(totalNftsBackground).fill([BACKGROUND_ASSET_ID]),
      to: RMRK_MINTER_ADDRESS,
    },
  ];

  await batchMintWithAssetsIds(inputDataArray, logFilePath);
};

// batchMintAllYourBaseNFTsWithAssetToAccount().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

// addAllYourBaseEquippableAssetEntries().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

mintMigrationRewardNFTsEntry().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// pinMetadatas().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
