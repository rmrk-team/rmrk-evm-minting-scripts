// import { pinMetadataFromFiles } from './pin-metadata-from-files';
// import { kanariaAllYourBaseMetadatas } from './input-data/all-your-base/kanaria-all-your-base-metadatas';
import {
  mintMigrationRewardNfts,
  NestMintWithAssetInputData,
} from './mint-migration-reward-nfts.js';
import {
  KANARIA_BIRD_CONTRACT,
  KANARIA_CATALOG_CONTRACT,
  KANARIA_ITEMS_CONTRACTS,
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

// const pinMetadatas = async () => {
//   await pinMetadataFromFiles(
//     kanariaAllYourBaseMetadatas,
//     'scripts/script-results-logs/all-your-base/all-your-base-metadata-pinning-logs.json',
//     process.env.FILEBASE_BUCKET_KANARIA,
//   );
// };

// pinMetadatas().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

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
      assetId: BigInt(33),
      collectionAddress: kanariaItemContracts.KANCHAMP,
      destinationCollectionAddress: kanariaContract,
      destinationTokenIds: migratedSnapshotKanariaIds,
    },
    {
      assetId: BigInt(34),
      collectionAddress: kanariaItemContracts.KANCHAMP,
      destinationCollectionAddress: kanariaContract,
      destinationTokenIds: tradedSnapshotKanariaIds,
    },
      // TODO: Headwear
    // {
    //   assetId: BigInt(35),
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
        metadataURI: 'ipfs://QmWGm2XvHJH6vLCKJoBc5569h2VfrUTDgnbCXYBLF8e1QY',
        partIds: [],
      },
    },
    {
      contractAddress: kanariaItemContracts.KANCHAMP,
      equippableAssetEntryFields: {
        equippableGroupId: BigInt(mapSlotToEquippableGroupId.background),
        catalogAddress: kanariaCatalogAddress,
        metadataURI: 'ipfs://QmbdofrTXkLrvRwNBQg8sxnHjjKQmFDNWhz9WGeeUxbTze',
        partIds: [],
      },
    },
    {
      contractAddress: kanariaItemContracts.KANCHAMP,
      equippableAssetEntryFields: {
        equippableGroupId: BigInt(mapSlotToEquippableGroupId.headwear),
        catalogAddress: kanariaCatalogAddress,
        metadataURI: 'ipfs://QmZjBVjUz8e2fhsLWX6vrkqsUdZ72FvVK5M2TYSwjs6Wf5',
        partIds: [],
      },
    },
  ];
  await addEquippableAssetEntries(inputData, logFilePath);
};

// addAllYourBaseEquippableAssetEntries().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });


mintMigrationRewardNFTsEntry().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
