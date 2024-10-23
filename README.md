# DebHome - Decentralized Real Estate Marketplace 🏠

DebHome is a decentralized web application that allows users to mint, list, and transfer real estate properties as NFTs on the Ethereum blockchain. Property owners can securely list properties, while buyers can purchase them through a streamlined property transfer process involving inspectors and loan providers. This application leverages smart contracts for property registration and transfer, making the real estate market more transparent and efficient.

## Features

- **Mint Properties:** Property owners can mint properties as NFTs, each representing a real-world asset.
- **List Properties for Sale:** Owners can list their properties for potential buyers.
- **Down Payments & Inspections:** Buyers can make down payments and inspectors can update the inspection status of properties.
- **Approval Process:** The sale process is finalized after the buyer, owner, inspector, and loan provider have approved the transaction.
- **Blockchain-Powered:** The backend operates entirely on Ethereum-based smart contracts, ensuring trust, transparency, and security.

## Project Structure

```bash
DebHome/
├── contracts/                # Smart contracts for property registry and transfer
│   ├── PropertyRegistry.sol
│   └── PropertyTransfer.sol
├── public/
│   ├── icons/
│   │   └── site-icon.ico     # Browser tab icon
│   ├── images/               # Images used in the app
│   │   ├── house1.png
│   │   ├── house2.png
│   │   ├── house3.png
│   │   ├── testHouse.png
│   │   └── search-background.png # Background image
│   └── index.html            # Main HTML file
├── scripts/
│   └── smartContractDeployer.js  # Script for deploying contracts to the blockchain
├── src/
│   ├── abis/                 # ABIs for interacting with the contracts
│   │   ├── PropertyRegistry.json
│   │   └── PropertyTransfer.json
│   ├── assets/               # Static assets like icons and logos
│   │   ├── close-icon.svg
│   │   └── brand-logo.svg
│   ├── components/           # React components for the frontend
│   │   ├── HeaderNavigation.js
│   │   ├── PropertyDetails.js
│   │   └── PropertySearch.js
│   ├── houseData/            # JSON files storing property details
│   │   ├── house1.json
│   │   ├── house2.json
│   │   ├── house3.json
│   │   └── testHouse.json
│   ├── App.js                # Main app logic
│   ├── config.json           # Configuration file for contract addresses
│   ├── index.css             # Style of the app
│   ├── index.js              # Entry point of the React app
│   └── setupTests.js         # Test setup
├── test/
│   └── PropertyTransfer.js   # Tests for the PropertyTransfer contract
├── hardhat.config.js         # Hardhat configuration
├── package.json              # Node.js dependencies and scripts
├── README.md                 # Project documentation
└── .gitignore                # Files to ignore in version control
```

## How to Run the Application

### Requirements

- [NodeJS](https://nodejs.org/en/) (Ensure you have it installed)
- [Hardhat](https://hardhat.org/getting-started/) (Ensure you have installed globally)
  ```bash
   $ npm install --save-dev hardhat
  ```
- [MetaMask Extension](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en) (Ensure you have it on your browser)

### MetaMask Setup

1. **Install the MetaMask extension** on your browser (if you haven't already).
2. **Add a Custom Network** in MetaMask:

   - Network Name: `Hardhat`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

- **Note:** If MetaMask isn't automatically connecting to the Hardhat network, manually switch networks from within the extension.

3. **Import Accounts from Hardhat**:

   - In MetaMask, go to the "Import Account" section and use the private keys below to import at least 4 accounts provided by Hardhat.

   - **Account 1**:

     - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
     - Name (optional): `Hardhat #0`

   - **Account 2**:

     - Private Key: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`
     - Name (optional): `Hardhat #1`

   - **Account 3**:

     - Private Key: `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`
     - Name (optional): `Hardhat #2`

   - **Account 4**:
     - Private Key: `0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6`
     - Name (optional): `Hardhat #3`

### Setting Up the Application

1. **Clone the repository**:

   ```bash
   $ git clone https://github.com/arshiaaienfaraz/debHome
   $ cd debHome
   ```

2. **Install the dependencies**:

   ```bash
   $ npm install
   ```

3. **Start the local Ethereum blockchain (Hardhat node)**:<br/>
   In a separate terminal window, run the local Blockchain:

   ```bash
   $ npm run blockchain
   ```

4. **Deploy the smart contracts**:

   ```bash
   $ npm run deploy
   ```

5. **Run the tests** (optional): <br/>
   You can run the tests to ensure everything is working as expected:

   ```bash
   $ npm run test
   ```

6. **Start the frontend**: <br/>
   Now start the React application to interact with the contracts:

   ```bash
   $ npm run start
   ```

---

### Interacting with DebHome

- Once the frontend is running, you can interact with the DApp. Mint properties, list them for sale, and go through the property transfer process!
- Make sure MetaMask is connected to the `Hardhat` network, and you're logged in with the appropriate accounts (Property Owner, Buyer, etc.) based on the use case.

---
