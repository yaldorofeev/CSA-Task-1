import 'dotenv/config';
import { types } from "hardhat/config";
import { task } from "hardhat/config";

task("approve", "Approve to transfer tokens")
  .addParam("requesting", "ID of accaunt in array in .env")
  .addParam("spender", "The account which was allowed to transfer tokens")
  .addParam("amount", "The amount of tokens to transfer")
  .setAction(async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  const contract = await hre.ethers.getContractAt("SuperToken",
  process.env.CONTRACT_ACCAUNT!, accounts[args.requesting]);
  contract.on("Approval", (owner, spender, amount, event) => {
    console.log({
      owner: owner,
      spender: spender,
      amount: amount.toNumber(),
      data: event
    });
  });
  const tx = await contract.approve(args.spender, args.amount);
});
