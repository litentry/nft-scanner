import { log, BigInt } from "@graphprotocol/graph-ts"
import {
  WrappedMoonCatsRescue,
  Approval,
  ApprovalForAll,
  Transfer
} from "../generated/WrappedMoonCatsRescue/WrappedMoonCatsRescue"
import { TokenHolder } from "../generated/schema"

export function handleTransfer(event: Transfer): void {
  let id = event.address.toHex() + '#' + event.params.tokenId.toHex();
  // let id = `${event.address}#${event.params.tokenId}`;
  // let id = event.params.to.toHex() + event.params.tokenId.toHex();

  log.info('handle transfer: id: {}, address: {}, tokenId: {}', [id, event.address.toString(), event.params.tokenId.toString()]);

  let entity = TokenHolder.load(id)
  if (entity == null) {
    entity = new TokenHolder(id);
  }
  entity.contract = event.address;
  entity.tokenId = event.params.tokenId;
  entity.owner = event.params.to;
  entity.save();
}
