// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.9;

contract TheGarden {
  event IpfsHashAdded(string ipfsHash, uint256 ipfsHashIndex, address proposer);
  event IpfsHashAccepted(string ipfsHash, uint256 ipfsHashIndex, address acceptor);
  event AcceptorAdded(address acceptor, uint256 acceptorIndex);
  event AcceptorRemoved(address acceptor, uint256 acceptorIndex);


  address public owner;

  uint256 public acceptorsCount;
  mapping(uint256 => address) public acceptors;

  uint256 public ipfsHashCount;
  mapping(uint256 => string) public ipfsHashes;
  mapping(uint256 => address) public ipfsHashProposers;

  constructor() {
    owner = msg.sender;
    acceptors[0] = msg.sender;
    acceptorsCount = 1;
    ipfsHashCount = 0;
  }

  function _isAcceptor(address _address) private view returns (bool) {
    for (uint256 i = 0; i < acceptorsCount; i++) {
      if (acceptors[i] == _address) {
        return true;
      }
    }
    return false;
  } 

  modifier onlyAcceptors() {
    require(_isAcceptor(msg.sender), "Only acceptors can perform this action");
    _;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can perform this action");
    _;
  }

  function addIpfsHash(string memory _ipfsHash) public {
    ipfsHashes[ipfsHashCount] = _ipfsHash;
    ipfsHashProposers[ipfsHashCount] = msg.sender;
    emit IpfsHashAdded(_ipfsHash, ipfsHashCount, msg.sender);
    ipfsHashCount += 1;
  }

  function acceptIpfsHash(uint256 _ipfsHashIndex) public onlyAcceptors {
    require(
      msg.sender == owner || msg.sender != ipfsHashProposers[_ipfsHashIndex],
      "Can't accept your own proposal"
    );

    emit IpfsHashAccepted(ipfsHashes[_ipfsHashIndex], _ipfsHashIndex, msg.sender);

    if (!_isAcceptor(ipfsHashProposers[_ipfsHashIndex])) {
      acceptors[acceptorsCount] = ipfsHashProposers[_ipfsHashIndex];
      emit AcceptorAdded(ipfsHashProposers[_ipfsHashIndex], acceptorsCount);
      acceptorsCount += 1;
    }
  }

  function removeAcceptor(uint256 _acceptorIndex) public onlyOwner {
    acceptors[_acceptorIndex] = address(0);
    emit AcceptorRemoved(acceptors[_acceptorIndex], _acceptorIndex);
  }
}
