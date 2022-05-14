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
