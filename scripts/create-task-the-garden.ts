import {
  AutomateSDK,
  TriggerType,
  Web3Function,
} from "@gelatonetwork/automate-sdk";
import hre from "hardhat";

const { ethers, w3f } = hre;

const main = async () => {
  const theGardenW3f = w3f.get("the-garden");

  // Deploy Web3Function on IPFS
  console.log("Deploying Web3Function on IPFS...");
  const cid = await theGardenW3f.deploy();
  console.log(`Web3Function IPFS CID: ${cid}`);

};

main()
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
