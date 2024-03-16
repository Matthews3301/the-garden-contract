import {
  AcceptorAdded as AcceptorAddedEvent,
  AcceptorRemoved as AcceptorRemovedEvent,
  IpfsHashAccepted as IpfsHashAcceptedEvent,
  IpfsHashAdded as IpfsHashAddedEvent
} from "../generated/TheGarden/TheGarden"
import {
  AcceptorAdded,
  AcceptorRemoved,
  IpfsHashAccepted,
  IpfsHashAdded
} from "../generated/schema"

export function handleAcceptorAdded(event: AcceptorAddedEvent): void {
  let entity = new AcceptorAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.acceptor = event.params.acceptor
  entity.acceptorIndex = event.params.acceptorIndex

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAcceptorRemoved(event: AcceptorRemovedEvent): void {
  let entity = new AcceptorRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.acceptor = event.params.acceptor
  entity.acceptorIndex = event.params.acceptorIndex

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleIpfsHashAccepted(event: IpfsHashAcceptedEvent): void {
  let entity = new IpfsHashAccepted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.ipfsHash = event.params.ipfsHash
  entity.ipfsHashIndex = event.params.ipfsHashIndex
  entity.acceptor = event.params.acceptor

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleIpfsHashAdded(event: IpfsHashAddedEvent): void {
  let entity = new IpfsHashAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.ipfsHash = event.params.ipfsHash
  entity.ipfsHashIndex = event.params.ipfsHashIndex
  entity.proposer = event.params.proposer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
