import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy";

import { deployments, getNamedAccounts, run, config } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";



async function main() {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const deployment = await deploy("Gathering", {
    from: deployer,
    log: true,
  });

  config.etherscan.apiKey = { polygon: process.env.ETHERSCAN_KEY ?? '' }
  const address = deployment.address;

  // wait here for the contract to propagate
  await new Promise(r => setTimeout(r, 30000));

  await run('verify:verify', {
    address: address,
    constructorArguments: [],
  });

}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
