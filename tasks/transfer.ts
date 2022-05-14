import 'dotenv/config';
import { types } from "hardhat/config";
import { task } from "hardhat/config";

task("transfer", "Transfer tokens")
  .addParam("requesting", "ID of accaunt in array in .env")
  .addParam("to", "The account which recieves tokens")
  .addParam("amount", "The amount of tokens to transfer")
  .setAction(async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  const contract = await hre.ethers.getContractAt("SuperToken",
  process.env.CONTRACT_ACCAUNT!, accounts[args.requesting]);
  contract.on("Transfer", (from, to, amount, event) => {
    console.log({
      from: from,
      to: to,
      amount: amount.toNumber(),
      data: event
    });
  });
  const tx = await contract.transfer(args.to, args.amount);
});
