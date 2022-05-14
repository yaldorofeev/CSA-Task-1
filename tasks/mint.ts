import 'dotenv/config';
import { types } from "hardhat/config";
import { task } from "hardhat/config";

task("mint", "Mint tokens")
  .addParam("requesting", "ID of accaunt in array in .env")
  .addParam("account", "The account that recieves tokens")
  .addParam("amount", "The amount of tokens to mint")
  .setAction(async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  const contract = await hre.ethers.getContractAt("SuperToken",
  process.env.CONTRACT_ACCAUNT!, accounts[args.requesting]);
  const tx = await contract.mint(args.account, args.amount);
  tx.wait();
  console.log(tx);
});
