const { HardhatUserConfig } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "../backend/.env" });

const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY ?? "0x0000000000000000000000000000000000000000000000000000000000000001";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY ?? "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    // ── Développement local ────────────────────────────────────────────
    hardhat: {
      chainId: 31337,
    },

    // ── Polygon Amoy Testnet ───────────────────────────────────────────
    polygonAmoy: {
      url: process.env.POLYGON_AMOY_RPC_URL ?? "https://rpc-amoy.polygon.technology",
      chainId: 80002,
      accounts: PRIVATE_KEY.length > 60 ? [PRIVATE_KEY] : [],
    },
  },

  // Vérification du contrat sur PolygonScan
  etherscan: {
    apiKey: {
      polygonAmoy: POLYGONSCAN_API_KEY,
    },
    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com",
        },
      },
    ],
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
