import hre from "hardhat";
import { expect } from "chai";
import { before } from "mocha";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import {
  Web3FunctionUserArgs,
  Web3FunctionResultV2,
} from "@gelatonetwork/web3-functions-sdk";
import { Web3FunctionHardhat } from "@gelatonetwork/web3-functions-sdk/hardhat-plugin";
import * as sinon from 'sinon';
import http from 'http';
const { ethers, deployments, w3f } = hre;

describe("TheGarden Tests", function () {
  this.timeout(0);

  let owner: SignerWithAddress;
  let theGardenW3f: Web3FunctionHardhat;
  let userArgs: Web3FunctionUserArgs;

  before(async function () {
    // await deployments.fixture();

    [owner] = await hre.ethers.getSigners();
    theGardenW3f = w3f.get("the-garden");

    userArgs = {
      test: true,
    };
  });

  it("canExec: true - First execution", async () => {

    let { result } = await theGardenW3f.run("onRun", { userArgs });
    result = result as Web3FunctionResultV2;

    expect(result.canExec).to.equal(true);
    if (!result.canExec) throw new Error("!result.canExec");

    const calldata = result.callData;
    expect(JSON.stringify(calldata)).to.equal('[]');
  });
});
