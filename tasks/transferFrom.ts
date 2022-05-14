import 'dotenv/config';
import { types } from "hardhat/config";
import { task } from "hardhat/config";

task("transferFrom", "Transfer tokens from another accaunt")
  .addParam("requesting", "ID of accaunt in array in .env")
  .addParam("from", "The account which transmit tokens")
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
  const tx = await contract.transferFrom(args.from, args.to, args.amount);
});
