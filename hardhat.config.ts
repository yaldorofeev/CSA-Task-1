// require("dotenv").config();
import 'dotenv/config';
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "./tasks/transfer.ts";
import "./tasks/transferFrom.ts";
import "./tasks/approve.ts";
import "./tasks/mint.ts";


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  solidity: {
    version: "0.8.6",
    settings: {
      optimizer: {enabled: process.env.DEBUG ? false : true},
    },
  },
  defaultNetwork: "rinkeby",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL,
      accounts:
        process.env.PRIVATE_KEY_OWNER !== undefined ? [process.env.PRIVATE_KEY_OWNER, process.env.PRIVATE_KEY_VOTER_1, process.env.PRIVATE_KEY_VOTER_2, process.env.PRIVATE_KEY_VOTER_3] : [],
      gasMultiplier: 1.2
    },
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts:
        process.env.PRIVATE_KEY_OWNER !== undefined ? [process.env.PRIVATE_KEY_OWNER, process.env.PRIVATE_KEY_VOTER_1, process.env.PRIVATE_KEY_VOTER_2, process.env.PRIVATE_KEY_VOTER_3] : [],
      gasMultiplier: 1.2
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
