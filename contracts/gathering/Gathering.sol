// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Gathering {
    event HashAdded();

    address public owner;
    string public ipfsHash;
    bool public hashSet;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    function setIPFSHash(string memory _ipfsHash) public onlyOwner {
        ipfsHash = _ipfsHash;
        hashSet = true;
        emit HashAdded();
    }

    function deleteIPFSHash() public onlyOwner {
        require(hashSet, "IPFS hash not set");
        ipfsHash = "";
        hashSet = false;
    }
}