// Import Hardhat runtime environment explicitly
const hre = require("hardhat");

// Utility function to handle token conversion to ether
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

async function main() {
  // Get the Chain ID
  const network = await ethers.provider.getNetwork();
  console.log(
    `Connected to network: ${network.name} (chainId: ${network.chainId})`
  );

  // Get the necessary signers (accounts)
  const [propertyBuyer, propertyOwner, inspector, loanProvider] =
    await ethers.getSigners();

  console.log("Deploying PropertyRegistry contract...");

  // Deploy the PropertyRegistry contract
  const PropertyRegistry = await ethers.getContractFactory("PropertyRegistry");
  const propertyRegistry = await PropertyRegistry.deploy();
  await propertyRegistry.deployed();
  console.log(`PropertyRegistry deployed at: ${propertyRegistry.address}`);

  console.log("Minting 3 properties...");

  // Mint 3 properties to the PropertyRegistry
  for (let i = 0; i < 3; i++) {
    const mintTransaction = await propertyRegistry
      .connect(propertyOwner)
      .mint(`/src/houseData/house${i + 1}.json`);
    await mintTransaction.wait();
    console.log(
      `Minted property ${i + 1} with metadata: /src/houseData/house${
        i + 1
      }.json`
    );
  }

  console.log("Deploying PropertyTransfer contract...");

  // Deploy the PropertyTransfer contract
  const PropertyTransfer = await ethers.getContractFactory("PropertyTransfer");
  const propertyTransfer = await PropertyTransfer.deploy(
    propertyRegistry.address, // NFT registry address
    propertyOwner.address, // Owner address
    inspector.address, // Inspector address
    loanProvider.address // Loan provider address
  );
  await propertyTransfer.deployed();
  console.log(`PropertyTransfer deployed at: ${propertyTransfer.address}`);

  console.log("Approving properties for transfer...");

  // Approve the properties for the PropertyTransfer contract
  for (let i = 0; i < 3; i++) {
    const approveTransaction = await propertyRegistry
      .connect(propertyOwner)
      .approve(propertyTransfer.address, i + 1);
    await approveTransaction.wait();
    console.log(
      `Approved transfer of property ${i + 1} to PropertyTransfer contract`
    );
  }

  console.log("Listing properties for sale...");

  // List the properties on the PropertyTransfer contract
  let listTransaction = await propertyTransfer
    .connect(propertyOwner)
    .listProperty(1, propertyBuyer.address, tokens(20), tokens(10)); // Listing property 1
  await listTransaction.wait();
  console.log("Listed property 1 for sale.");

  listTransaction = await propertyTransfer
    .connect(propertyOwner)
    .listProperty(2, propertyBuyer.address, tokens(15), tokens(5)); // Listing property 2
  await listTransaction.wait();
  console.log("Listed property 2 for sale.");

  listTransaction = await propertyTransfer
    .connect(propertyOwner)
    .listProperty(3, propertyBuyer.address, tokens(10), tokens(5)); // Listing property 3
  await listTransaction.wait();
  console.log("Listed property 3 for sale.");

  console.log("Deployment and setup finished successfully.");
}

// Main function for async handling and error management
main().catch((error) => {
  console.error("Error during deployment:", error);
  process.exitCode = 1;
});
