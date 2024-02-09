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
  const publicClient = await hre.viem.getPublicClient();

  for (const contract of contracts) {
    console.log(
      `Managing contributor: Setting contributor ${contributor} on contract ${contract} to a new state ${isContributor}`,
    );
    const { request } = await publicClient.simulateContract({
      abi: ManageContributor,
      address: contract,
      functionName: 'manageContributor',
      args: [contributor, isContributor],
    });
    console.log('Sending transaction');
    const hash = await walletClient.writeContract(request);
    console.log('Waiting for transaction receipt for hash', hash);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log('Transaction success', hash);
  }

  console.log('All done');
};
