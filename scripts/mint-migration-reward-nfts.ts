import hre from 'hardhat';

export const mintMigrationRewardNfts = async () => {
    const network = hre.network.name;
    const [kanariaMinterWalletClient] = await hre.viem.getWalletClients();
}
