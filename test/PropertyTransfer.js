const { expect } = require("chai");
const { ethers } = require("hardhat");

// Helper function to convert tokens
const toTokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("PropertyTransfer Contract", () => {
  let propertyBuyer, propertyOwner, inspector, loanProvider;
  let registryContract, transferContract;

  beforeEach(async () => {
    // Set up accounts
    [propertyBuyer, propertyOwner, inspector, loanProvider] =
      await ethers.getSigners();

    // Deploy PropertyRegistry contract
    const PropertyRegistry = await ethers.getContractFactory(
      "PropertyRegistry"
    );
    registryContract = await PropertyRegistry.deploy();

    // Mint property (NFT)
    const mintTx = await registryContract
      .connect(propertyOwner)
      .mint("http://localhost:3000/houseData/testHouse.json");
    await mintTx.wait();

    // Deploy PropertyTransfer contract
    const PropertyTransfer = await ethers.getContractFactory(
      "PropertyTransfer"
    );
    transferContract = await PropertyTransfer.deploy(
      registryContract.address,
      propertyOwner.address,
      inspector.address,
      loanProvider.address
    );

    // Approve property for transfer
    const approveTx = await registryContract
      .connect(propertyOwner)
      .approve(transferContract.address, 1);
    await approveTx.wait();

    // List property for sale
    const listTx = await transferContract
      .connect(propertyOwner)
      .listProperty(1, propertyBuyer.address, toTokens(10), toTokens(5));
    await listTx.wait();
  });

  describe("Deployment Checks", () => {
    it("Correctly returns the NFT address", async () => {
      const result = await transferContract.tokenAddress();
      expect(result).to.be.equal(registryContract.address);
    });

    it("Correctly returns the property owner", async () => {
      const result = await transferContract.propertyOwner();
      expect(result).to.be.equal(propertyOwner.address);
    });

    it("Correctly returns the inspector", async () => {
      const result = await transferContract.inspector();
      expect(result).to.be.equal(inspector.address);
    });

    it("Correctly returns the loan provider", async () => {
      const result = await transferContract.loanProvider();
      expect(result).to.be.equal(loanProvider.address);
    });
  });

  describe("Property Listing", () => {
    it("Marks property as listed", async () => {
      const listed = await transferContract.isListed(1);
      expect(listed).to.be.equal(true);
    });

    it("Correctly stores the buyer's address", async () => {
      const buyerAddress = await transferContract.propertyBuyer(1);
      expect(buyerAddress).to.be.equal(propertyBuyer.address);
    });

    it("Correctly stores the purchase price", async () => {
      const price = await transferContract.purchasePrice(1);
      expect(price).to.be.equal(toTokens(10));
    });

    it("Correctly stores the transfer amount", async () => {
      const transferAmount = await transferContract.propertyTransferAmount(1);
      expect(transferAmount).to.be.equal(toTokens(5));
    });

    it("Transfers property ownership to the contract", async () => {
      expect(await registryContract.ownerOf(1)).to.be.equal(
        transferContract.address
      );
    });
  });

  describe("Deposit Handling", () => {
    beforeEach(async () => {
      const downPaymentTx = await transferContract
        .connect(propertyBuyer)
        .downPayment(1, { value: toTokens(5) });
      await downPaymentTx.wait();
    });

    it("Updates the contract balance after deposit", async () => {
      const balance = await transferContract.getBalance();
      expect(balance).to.be.equal(toTokens(5));
    });
  });

  describe("Inspection Status", () => {
    beforeEach(async () => {
      const inspectionTx = await transferContract
        .connect(inspector)
        .updateInspectionStatus(1, true);
      await inspectionTx.wait();
    });

    it("Correctly updates the inspection status", async () => {
      const status = await transferContract.inspectionPassed(1);
      expect(status).to.be.equal(true);
    });
  });

  describe("Approval Process", () => {
    beforeEach(async () => {
      await transferContract.connect(propertyBuyer).approveSale(1);
      await transferContract.connect(propertyOwner).approveSale(1);
      await transferContract.connect(loanProvider).approveSale(1);
    });

    it("Correctly updates approval statuses", async () => {
      const buyerApproval = await transferContract.approval(
        1,
        propertyBuyer.address
      );
      const ownerApproval = await transferContract.approval(
        1,
        propertyOwner.address
      );
      const lenderApproval = await transferContract.approval(
        1,
        loanProvider.address
      );

      expect(buyerApproval).to.equal(true);
      expect(ownerApproval).to.equal(true);
      expect(lenderApproval).to.equal(true);
    });
  });

  describe("Finalizing the Sale", () => {
    beforeEach(async () => {
      await transferContract
        .connect(propertyBuyer)
        .downPayment(1, { value: toTokens(5) });
      await transferContract.connect(inspector).updateInspectionStatus(1, true);
      await transferContract.connect(propertyBuyer).approveSale(1);
      await transferContract.connect(propertyOwner).approveSale(1);
      await transferContract.connect(loanProvider).approveSale(1);

      // Send full payment
      await loanProvider.sendTransaction({
        to: transferContract.address,
        value: toTokens(5),
      });

      // Finalize the sale
      const finalizeTx = await transferContract
        .connect(propertyOwner)
        .finalizeSale(1);
      await finalizeTx.wait();
    });

    it("Transfers ownership to the buyer", async () => {
      expect(await registryContract.ownerOf(1)).to.be.equal(
        propertyBuyer.address
      );
    });

    it("Resets the contract balance to zero", async () => {
      expect(await transferContract.getBalance()).to.be.equal(0);
    });
  });
});
