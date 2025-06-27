# 🐟 DON'T FEED THE BEAST

A dynamic NFT (ERC721) project for the Monad testnet, where NFTs can level up by burning MON (the native token). This repository contains both the smart contract and a React-based frontend for interacting with the NFT.

---

## Table of Contents

- [Features](#features)
- [Smart Contract](#smart-contract)
- [Frontend](#frontend)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Smart Contract (Hardhat)](#smart-contract-hardhat)
  - [Frontend (React)](#frontend-react)
- [Usage](#usage)
- [License](#license)

---

## Features

- 🪙 **Mint** a level 1 NFT by burning 0.1 MON (one per wallet)
- 🆙 **Level up** your NFT up to level 10 by burning more MON
- 💸 **Level up cost:** 0.1 MON base + (next level × 0.1 MON)
  - Level 2: 0.1 + 0.2 = 0.3 MON
  - Level 3: 0.1 + 0.3 = 0.4 MON
  - ...
  - Level 10: 0.1 + 1.0 = 1.1 MON
- 👤 Only the owner can level up their NFT
- 🔥 MON is burned on mint and level up
- 🖼️ Dynamic NFT images and metadata per level
- 🦊 MetaMask wallet integration in the frontend

---

## Smart Contract

- **File:** [`contracts/DynamicLevelNFT.sol`](contracts/DynamicLevelNFT.sol)
- **Standard:** ERC721
- **Network:** Monad testnet
- **Main Functions:**
  - `mint()`: Mint a new NFT (payable: 0.1 MON)
  - `levelUp(tokenId)`: Level up your NFT (payable: see above)
- **Events:**
  - `Minted(address to, uint256 tokenId)`
  - `LeveledUp(address owner, uint256 tokenId, uint256 newLevel)`

---

## Frontend

- **Directory:** [`frontend/`](frontend/)
- **Tech:** React, ethers.js, MetaMask
- **Main Features:**
  - Connect wallet
  - Mint NFT
  - View NFT and its level
  - Level up NFT
  - Dynamic NFT image per level
- **Contract address:** Set in [`frontend/src/contract.js`](frontend/src/contract.js)

---

## Project Structure

```
MonDNFT/
├── contracts/           # Solidity smart contracts
│   ├── DynamicLevelNFT.sol
│   └── Lock.sol
├── frontend/            # React frontend app
│   ├── src/
│   │   ├── App.js
│   │   ├── contract.js
│   │   ├── index.css
│   │   └── ...
│   └── public/
├── scripts/             # Deployment scripts
│   └── deploy.js
├── ignition/            # Hardhat Ignition deployment modules
│   └── modules/
├── test/                # Contract tests
├── hardhat.config.js    # Hardhat config
└── README.md            # This file
```

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- [MetaMask](https://metamask.io/) browser extension
- Monad testnet access

---

### Smart Contract (Hardhat)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Compile contracts:**
   ```bash
   npx hardhat compile
   ```

3. **Run tests:**
   ```bash
   npx hardhat test
   ```

4. **Deploy to Monad testnet:**
   - Update your network config in `hardhat.config.js`
   - Run:
     ```bash
     npx hardhat run scripts/deploy.js --network <your-monad-testnet>
     ```
   - Or use Hardhat Ignition:
     ```bash
     npx hardhat ignition deploy ./ignition/modules/DynamicLevelNFT.js
     ```

---

### Frontend (React)

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the app:**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Configure contract address:**
   - Set your deployed contract address in [`src/contract.js`](frontend/src/contract.js)

---

## Usage

- **Connect your MetaMask wallet** (Monad testnet)
- **Mint** your NFT by clicking "FEED THE BEAST (0.1 MON)"
- **Level up** your NFT by clicking "FEED THE BEAST (cost: X MON)"
- **View your NFT** and its current level and image

---

## License

This project is licensed under the MIT License.

---

## Acknowledgements

- [Create React App](https://github.com/facebook/create-react-app)
- [ethers.js](https://docs.ethers.org/)
- [OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)
- Monad testnet

