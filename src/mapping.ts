import { BigInt } from "@graphprotocol/graph-ts"
import {
  WrappedMoonCatsRescue,
  Approval,
  ApprovalForAll,
  Transfer
} from "../generated/WrappedMoonCatsRescue/WrappedMoonCatsRescue"
import { TokenHolder } from "../generated/schema"

export function handleTransfer(event: Transfer): void {
  const id = event.address + '#' + event.params.tokenId;
  let entity = TokenHolder.load(id)
  if (entity == null) {
    entity = new TokenHolder(id)
  }
  entity.contract = event.address;
  entity.tokenId = event.params.tokenId;
  entity.owner = event.params.to;
}
