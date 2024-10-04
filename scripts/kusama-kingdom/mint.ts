import hre from 'hardhat';
import type { Address } from 'viem';
import { sleep } from '../utils/utils.js';
import { KUSAMA_KINGDOM_METADATA_IPFS_BASE } from './consts.js';
import { KUSAMA_KINGDOM_KUSAMA_DETAILS } from './kusama-details.js';

export const mint = async ({
  id,
  address,
}: { id: keyof typeof KUSAMA_KINGDOM_KUSAMA_DETAILS; address: Address }) => {
  const [minterWallet] = await hre.viem.getWalletClients();
  const publicClient = await hre.viem.getPublicClient();
  const config = KUSAMA_KINGDOM_KUSAMA_DETAILS[id];

  const contract = await hre.viem.getContractAt('NFT721KusamaKingdom', address);

  let i = 1;
  while (i <= config.maxSupply) {
    const hash = await contract.write.safeMint([
      minterWallet.account.address,
      BigInt(i),
      `${KUSAMA_KINGDOM_METADATA_IPFS_BASE}/${id}/nfts/${i}.json`,
    ]);
    console.log('hash', hash);
    await publicClient.waitForTransactionReceipt({ hash });
    await sleep(1000);
    i++;
  }
};
