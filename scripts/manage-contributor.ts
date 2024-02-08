import hre from 'hardhat';
import { Address } from 'viem';
import { ManageContributor } from '../abis/ManageContributor.js';

export const manageContributor = async (
  contracts: Address[],
  contributor: Address,
  isContributor: boolean,
) => {
  const network = hre.network.name;
  const [walletClient] = await hre.viem.getWalletClients();

  for (const contract of contracts) {
    console.log(
      `Managing contributor: Setting contributor ${contributor} on contract ${contract} to a new state ${isContributor}`,
    );
    await walletClient.writeContract({
      abi: ManageContributor,
      address: contract,
      functionName: 'manageContributor',
      args: [contributor, isContributor],
    });
  }

  console.log('All done');
};
