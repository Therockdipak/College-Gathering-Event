const { ethers } = require("hardhat");

async function main() {
  const instance = await ethers.getContractFactory("CollegeGatheringEvents");
  const contract = await instance.deploy();
  await contract.deployed();

  console.log("your contract address is: ", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//contract address== 0x5FbDB2315678afecb367f032d93F642f64180aa3
