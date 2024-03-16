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

describe("ApiPost Tests", function () {
  this.timeout(0);

  let owner: SignerWithAddress;
  let apiPostW3f: Web3FunctionHardhat;
  let userArgs: Web3FunctionUserArgs;

  before(async function () {
    // await deployments.fixture();

    [owner] = await hre.ethers.getSigners();
    apiPostW3f = w3f.get("api-post");

    userArgs = {
      gatheringAddress: "0x08402801A1B76DbcD604201284B8d8949329f2a1",
      test: true,
    };
  });

  it("canExec: true - First execution", async () => {

    let { result } = await apiPostW3f.run("onRun", { userArgs });
    result = result as Web3FunctionResultV2;

    expect(result.canExec).to.equal(true);
    if (!result.canExec) throw new Error("!result.canExec");

    const calldata = result.callData;
    expect(JSON.stringify(calldata)).to.equal('[]');
  });
});
