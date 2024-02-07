import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import {
  astar,
  baseSepolia,
  mainnet,
  moonbeam,
  polygonMumbai,
  sepolia,
} from "viem/chains";

const config: HardhatUserConfig = {
  solidity: "0.8.21",
  networks: {
    baseSepolia: {
      chainId: baseSepolia.id,
      url: process.env.BASE_GOERLI_URL || "https://sepolia.base.org",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 2000000000,
    },
    mumbai: {
      url: process.env.MUMBAI_URL || "https://rpc-mumbai.maticvigil.com",
      chainId: polygonMumbai.id,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 2500000000,
    },
    sepolia: {
      url: process.env.SEPOLIA_URL || "https://rpc.sepolia.dev",
      chainId: sepolia.id,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    ethereum: {
      url: process.env.ETHEREUM_URL || "https://eth.drpc.org",
      chainId: mainnet.id,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      // gasPrice: 12000000000,
    },
    astar: {
      url: process.env.ASTAR_URL || "https://evm.astar.network",
      chainId: astar.id,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    moonbeam: {
      url: process.env.MOONBEAM_URL || "https://rpc.api.moonbeam.network",
      chainId: moonbeam.id,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      baseSepolia: process.env.BASESCAN_API_KEY || "", // Base Goerli Etherscan API Key
      sepolia: process.env.ETHERSCAN_API_KEY || "", // Sepolia Etherscan API Key
      mumbai: process.env.POLYGONSCAN_API_KEY || "", // Polygon Mumbai Etherscan API Key
      ethereum: process.env.ETHERSCAN_API_KEY || "", // Ethereum Etherscan API Key
      moonbeam: process.env.MOONSCAN_APIKEY || "", // Moonbeam Moonscan API Key
    },
    customChains: [
      {
        network: "baseSepolia",
        chainId: baseSepolia.id,
        urls: {
          apiURL: "https://base-sepolia.blockscout.com/api",
          browserURL: "https://base-sepolia.blockscout.com",
        },
      },
      {
        network: "astar",
        chainId: 592,
        urls: {
          apiURL: "https://blockscout.com/astar/api",
          browserURL: "https://blockscout.com/astar",
        },
      },
    ],
  },
};

export default config;
