const { ethers } = require("hardhat");

async function main() {
  const ConsentToken = await ethers.getContractFactory("ConsentToken");
  const consentToken = await ConsentToken.deploy();
  await consentToken.waitForDeployment();
  console.log("ConsentToken deployed to:", await consentToken.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 