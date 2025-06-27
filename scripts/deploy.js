const hre = require("hardhat");

async function main() {
  const DynamicLevelNFT = await hre.ethers.getContractFactory("DynamicLevelNFT");
  const dynamicLevelNFT = await DynamicLevelNFT.deploy();
  await dynamicLevelNFT.deployed();
  console.log("DynamicLevelNFT deployed to:", dynamicLevelNFT.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 