import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AcceptorAdded,
  AcceptorRemoved,
  IpfsHashAccepted,
  IpfsHashAdded
} from "../generated/TheGarden/TheGarden"

export function createAcceptorAddedEvent(
  acceptor: Address,
  acceptorIndex: BigInt
): AcceptorAdded {
  let acceptorAddedEvent = changetype<AcceptorAdded>(newMockEvent())

  acceptorAddedEvent.parameters = new Array()

  acceptorAddedEvent.parameters.push(
    new ethereum.EventParam("acceptor", ethereum.Value.fromAddress(acceptor))
  )
  acceptorAddedEvent.parameters.push(
    new ethereum.EventParam(
      "acceptorIndex",
      ethereum.Value.fromUnsignedBigInt(acceptorIndex)
    )
  )

  return acceptorAddedEvent
}

export function createAcceptorRemovedEvent(
  acceptor: Address,
  acceptorIndex: BigInt
): AcceptorRemoved {
  let acceptorRemovedEvent = changetype<AcceptorRemoved>(newMockEvent())

  acceptorRemovedEvent.parameters = new Array()

  acceptorRemovedEvent.parameters.push(
    new ethereum.EventParam("acceptor", ethereum.Value.fromAddress(acceptor))
  )
  acceptorRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "acceptorIndex",
      ethereum.Value.fromUnsignedBigInt(acceptorIndex)
    )
  )

  return acceptorRemovedEvent
}

export function createIpfsHashAcceptedEvent(
  ipfsHash: string,
  ipfsHashIndex: BigInt,
  acceptor: Address
): IpfsHashAccepted {
  let ipfsHashAcceptedEvent = changetype<IpfsHashAccepted>(newMockEvent())

  ipfsHashAcceptedEvent.parameters = new Array()

  ipfsHashAcceptedEvent.parameters.push(
    new ethereum.EventParam("ipfsHash", ethereum.Value.fromString(ipfsHash))
  )
  ipfsHashAcceptedEvent.parameters.push(
    new ethereum.EventParam(
      "ipfsHashIndex",
      ethereum.Value.fromUnsignedBigInt(ipfsHashIndex)
    )
  )
  ipfsHashAcceptedEvent.parameters.push(
    new ethereum.EventParam("acceptor", ethereum.Value.fromAddress(acceptor))
  )

  return ipfsHashAcceptedEvent
}

export function createIpfsHashAddedEvent(
  ipfsHash: string,
  ipfsHashIndex: BigInt,
  proposer: Address
): IpfsHashAdded {
  let ipfsHashAddedEvent = changetype<IpfsHashAdded>(newMockEvent())

  ipfsHashAddedEvent.parameters = new Array()

  ipfsHashAddedEvent.parameters.push(
    new ethereum.EventParam("ipfsHash", ethereum.Value.fromString(ipfsHash))
  )
  ipfsHashAddedEvent.parameters.push(
    new ethereum.EventParam(
      "ipfsHashIndex",
      ethereum.Value.fromUnsignedBigInt(ipfsHashIndex)
    )
  )
  ipfsHashAddedEvent.parameters.push(
    new ethereum.EventParam("proposer", ethereum.Value.fromAddress(proposer))
  )

  return ipfsHashAddedEvent
}
