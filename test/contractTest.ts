import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer, Contract } from "ethers";

describe("Test SuperToken contract", function () {

  let superToken: Contract;
  let accounts: Signer[];

  it("Should deploy contract", async function () {
    accounts = await ethers.getSigners();
    const SuperToken = await ethers.getContractFactory("SuperToken");
    superToken = await SuperToken.deploy("SuperToken", "ST", 18);
    await superToken.deployed();
    console.log(superToken.address);
  });

  it("Should test init state", async function () {
    expect(await superToken.connect(accounts[0]).name()).to.equal("SuperToken");
    expect(await superToken.connect(accounts[0]).symbol()).to.equal("ST");
    expect(await superToken.connect(accounts[0]).decimals()).to.equal(18);
    expect(await superToken.connect(accounts[0]).totalSupply()).to.equal(0);
  });

  describe("Test mint function", function () {

    it("Mint tokens by non-owner", async function () {
      await expect(superToken.connect(accounts[1])
      .mint(accounts[1].getAddress(), 100))
      .to.be.revertedWith("Mint by address without access");
    });

    it("Mint tokens to zero-address", async function () {
      await expect(superToken.connect(accounts[0])
      .mint(ethers.constants.AddressZero, 100))
      .to.be.revertedWith("Mint to the zero address");
    });

    it("Mint tokens", async function () {
      await expect(superToken.connect(accounts[0])
      .mint(accounts[1].getAddress(), 1000))
      .to.emit(superToken, "Transfer")
      .withArgs(ethers.constants.AddressZero, await accounts[1].getAddress(), 1000);
      const balance = await superToken.connect(accounts[1])
      .balanceOf(accounts[1].getAddress());
      expect(balance).to.equal(1000);
    });
  });

  describe("Test transfer function", function () {

    it("Transfer tokens to zero-address", async function () {
      await expect(superToken.connect(accounts[1])
      .transfer(ethers.constants.AddressZero, 300))
      .to.be.revertedWith("Transfer to the zero address");
    });

    it("Transfer when not enaught tokens", async function () {
      await expect(superToken.connect(accounts[1])
      .transfer(accounts[2].getAddress(), 1001))
      .to.be.revertedWith("Not enaught tokens");
    });

    it("Transfer with event", async function () {
        await expect(superToken.connect(accounts[1])
        .transfer(accounts[2].getAddress(), 300))
        .to.emit(superToken, "Transfer")
        .withArgs(await accounts[1].getAddress(), await accounts[2].getAddress(), 300);
        const balance = await superToken.connect(accounts[2])
        .balanceOf(accounts[2].getAddress());
        expect(balance).to.equal(300);
    });
  });

  describe("Test transferFrom and approve functions", function () {

    it("TransferFrom tokens from zero-address", async function () {
      await expect(superToken.connect(accounts[3])
      .transferFrom(ethers.constants.AddressZero, accounts[2].getAddress(), 300))
      .to.be.revertedWith("Transfer from the zero address");
    });

    it("TransferFrom tokens to zero-address", async function () {
      await expect(superToken.connect(accounts[3])
      .transferFrom(accounts[1].getAddress(), ethers.constants.AddressZero, 300))
      .to.be.revertedWith("Transfer to the zero address");
    });

    it("TransferFrom when not enaught tokens", async function () {
      await expect(superToken.connect(accounts[3])
      .transferFrom(accounts[1].getAddress(), accounts[2].getAddress(), 701))
      .to.be.revertedWith("Not enaught tokens");
    });

    it("TransferFrom when no allowance", async function () {
      await expect(superToken.connect(accounts[3])
      .transferFrom(accounts[1].getAddress(), accounts[2].getAddress(), 300))
      .to.be.revertedWith("There is no allowance of this transfer");
    });

    it("Approve for zero-address", async function () {
      await expect(superToken.connect(accounts[1])
      .approve(ethers.constants.AddressZero, 300))
      .to.be.revertedWith("Approve for the zero address");
    });

    it("Approve with event", async function () {
        await expect(superToken.connect(accounts[1])
        .approve(accounts[3].getAddress(), 300))
        .to.emit(superToken, "Approval")
        .withArgs(await accounts[1].getAddress(), await accounts[3].getAddress(), 300);
        const allowance = await superToken.connect(accounts[2])
        .allowance(accounts[1].getAddress(), accounts[3].getAddress());
        expect(allowance).to.equal(300);
    });

    it("TransferFrom with event", async function () {
        await expect(superToken.connect(accounts[3])
        .transferFrom(accounts[1].getAddress(), accounts[2].getAddress(), 300))
        .to.emit(superToken, "Transfer")
        .withArgs(await accounts[1].getAddress(), await accounts[2].getAddress(), 300);
        const balance = await superToken.connect(accounts[2])
        .balanceOf(accounts[2].getAddress());
        expect(balance).to.equal(600);
    });
  });

  describe("Test burn function", function () {

    it("Burn tokens by nither owner nor admin", async function () {
      await expect(superToken.connect(accounts[1])
      .burn(accounts[2].getAddress(), 200))
      .to.be.revertedWith("Burn from address without access");
    });

    it("Burn tokens from zero-address", async function () {
      await expect(superToken.connect(accounts[0])
      .burn(ethers.constants.AddressZero, 200))
      .to.be.revertedWith("Burn from the zero address");
    });

    it("Burn too many tokens", async function () {
      await expect(superToken.connect(accounts[0])
      .burn(accounts[2].getAddress(), 601))
      .to.be.revertedWith("Burn amount exceeds balance");
    });

    it("Burn tokens by admin with event", async function () {
      await expect(superToken.connect(accounts[0])
      .burn(accounts[2].getAddress(), 200))
      .to.emit(superToken, "Transfer")
      .withArgs(await accounts[2].getAddress(), ethers.constants.AddressZero, 200);
      const balance = await superToken.connect(accounts[2])
      .balanceOf(accounts[2].getAddress());
      expect(balance).to.equal(400);
    });

    it("Burn tokens by owner with event", async function () {
      await expect(superToken.connect(accounts[2])
      .burn(accounts[2].getAddress(), 200))
      .to.emit(superToken, "Transfer")
      .withArgs(await accounts[2].getAddress(), ethers.constants.AddressZero, 200);
      const balance = await superToken.connect(accounts[2])
      .balanceOf(accounts[2].getAddress());
      expect(balance).to.equal(200);
    });
  });
});
