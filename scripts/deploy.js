// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const NFTMinter = await hre.ethers.getContractFactory("NFTMinter");
  const name = "PolyNFTMinter";
  const symbol = "PNM";
  const baseuri = "ipfs://QmXfkPA62p1d6dcibtUMP43JkrT8ttptKFMVK4wAPP928E/";
  const payment = '0x0000000000000000000000000000000000000000';

  const minter = await NFTMinter.deploy(name, symbol, baseuri, payment);

  await minter.deployed();

  console.log("Minter deployed to:", minter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
