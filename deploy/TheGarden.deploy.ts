import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy";

import { deployments, getNamedAccounts, run, config } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "ethers";


function gweiToWei(gweiAmount: number) {
  return ethers.utils.parseUnits(gweiAmount.toString(), "gwei");
}

async function main() {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const deployment = await deploy("TheGarden", {
    from: deployer,
    log: true,
    // nonce: 22,
    // gasPrice: gweiToWei(130)
  });
  // Check Alchemy for nonce if stuck

  config.etherscan.apiKey = { polygon: process.env.ETHERSCAN_KEY ?? '' }
  const address = deployment.address;
  console.log('TheGarden deployed to:', address)

  // wait here for the contract to propagate
  await new Promise(r => setTimeout(r, 50000));

  await run('verify:verify', {
    address: address,
    constructorArguments: [],
  });

}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
