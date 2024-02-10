import hre from 'hardhat';
import invariant from 'tiny-invariant';
import { KANARIA_ITEMS_CONTRACTS } from './consts/kanaria-contracts.js';
import { ITEM_BATCH_MINTER_ADDRESS } from './consts/rmrk-contracts.js';
import { manageContributor } from './manage-contributor.js';

export const manageContributorEntry = async () => {
  const chainId = hre.network.config.chainId;

  invariant(chainId, 'Chain ID is not defined');

  const contributor =
    ITEM_BATCH_MINTER_ADDRESS[
      chainId as keyof typeof ITEM_BATCH_MINTER_ADDRESS
    ];

  if (chainId in KANARIA_ITEMS_CONTRACTS) {
    const kanariaItemContracts =
      KANARIA_ITEMS_CONTRACTS[chainId as keyof typeof KANARIA_ITEMS_CONTRACTS];
    await manageContributor(
      Object.values(kanariaItemContracts),
      contributor,
      true,
    );
  }
};

manageContributorEntry().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
