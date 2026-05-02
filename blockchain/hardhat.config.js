import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config({ path: "../backend/.env" });

const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY ?? "0x0000000000000000000000000000000000000000000000000000000000000001";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY ?? "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },

  networks: {
    hardhat: { chainId: 31337 },

    polygonAmoy: {
      url: process.env.POLYGON_AMOY_RPC_URL ?? "https://rpc-amoy.polygon.technology",
      chainId: 80002,
      accounts: [PRIVATE_KEY],
    },
  },

  etherscan: {
    apiKey: { polygonAmoy: POLYGONSCAN_API_KEY },
    customChains: [{
      network: "polygonAmoy",
      chainId: 80002,
      urls: {
        apiURL: "https://api-amoy.polygonscan.com/api",
        browserURL: "https://amoy.polygonscan.com",
      },
    }],
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
