const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DynamicLevelNFTModule", (m) => {
  const dynamicLevelNFT = m.contract("DynamicLevelNFT");
  return { dynamicLevelNFT };
}); 