import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import '@nomicfoundation/hardhat-toolbox-viem';
import 'dotenv/config';
import { TASK_COMPILE_SOLIDITY } from 'hardhat/builtin-tasks/task-names.js';

import { type HardhatUserConfig, subtask } from 'hardhat/config.js';
import {
  astar,
  base,
  baseSepolia,
  bob,
  mainnet,
  moonbeam,
  moonriver,
  polygonMumbai,
  sepolia,
} from 'viem/chains';

subtask(TASK_COMPILE_SOLIDITY).setAction(async (_, { config }, runSuper) => {
  const superRes = await runSuper();

  try {
    await writeFile(join(config.paths.artifacts, 'package.json'), '{ "type": "commonjs" }');
  } catch (error) {
    console.error('Error writing package.json: ', error);
  }

  return superRes;
});

const config: HardhatUserConfig = {
  solidity: '0.8.21',
  networks: {
    base: {
      url: process.env.BASE || 'https://mainnet.base.org',
      chainId: base.id,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    baseSepolia: {
      chainId: baseSepolia.id,
      url: process.env.BASE_GOERLI_URL || 'https://sepolia.base.org',
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    mumbai: {
      url: process.env.MUMBAI_URL || 'https://rpc-mumbai.maticvigil.com',
      chainId: polygonMumbai.id,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 2500000000,
    },
    sepolia: {
      url: process.env.SEPOLIA_URL || 'https://rpc.sepolia.dev',
      chainId: sepolia.id,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    ethereum: {
      url: process.env.ETHEREUM_URL || 'https://eth.drpc.org',
      chainId: mainnet.id,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      // gasPrice: 12000000000,
    },
    astar: {
      url: process.env.ASTAR_URL || 'https://evm.astar.network',
      chainId: astar.id,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    moonbeam: {
      url: process.env.MOONBEAM_URL || 'https://rpc.api.moonbeam.network',
      chainId: moonbeam.id,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    moonbaseAlpha: {
      url: 'https://moonbase-alpha.public.blastapi.io',
      chainId: 1287,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 1000000000,
    },
    moonriver: {
      url: process.env.MOONRIVER_URL || 'https://rpc.api.moonriver.moonbeam.network',
      chainId: moonriver.id,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    bob: {
      url: 'https://rpc.gobob.xyz/',
      chainId: bob.id,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      base: process.env.BASESCAN_API_KEY || '', // Base Etherscan API Key
      baseSepolia: process.env.BASESCAN_API_KEY || '', // Base Goerli Etherscan API Key
      sepolia: process.env.ETHERSCAN_API_KEY || '', // Sepolia Etherscan API Key
      mumbai: process.env.POLYGONSCAN_API_KEY || '', // Polygon Mumbai Etherscan API Key
      ethereum: process.env.ETHERSCAN_API_KEY || '', // Ethereum Etherscan API Key
      moonbeam: process.env.MOONSCAN_APIKEY || '', // Moonbeam Moonscan API Key
      moonbaseAlpha: process.env.MOONBEAM_MOONSCAN_APIKEY || '', // Moonbeam Moonscan API Key
      bob: process.env.BOBSCAN_APIKEY || '', // Bob Testnet API Key
    },
    customChains: [
      {
        network: 'baseSepolia',
        chainId: baseSepolia.id,
        urls: {
          apiURL: 'https://base-sepolia.blockscout.com/api',
          browserURL: 'https://base-sepolia.blockscout.com',
        },
      },
      {
        network: 'astar',
        chainId: astar.id,
        urls: {
          apiURL: 'https://blockscout.com/astar/api',
          browserURL: 'https://blockscout.com/astar',
        },
      },
      {
        network: 'base',
        chainId: base.id,
        urls: {
          apiURL: 'https://api.basescan.org/api',
          browserURL: 'https://basescan.org',
        },
      },
      {
        network: 'bob',
        chainId: 60808,
        urls: {
          apiURL: 'https://explorer.gobob.xyz/api',
          browserURL: 'https://explorer.gobob.xyz/',
        },
      },
    ],
  },
};

export default config;
