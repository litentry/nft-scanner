import { log, BigInt } from "@graphprotocol/graph-ts"
import {
  CryptoPunksMarket,
  Transfer
} from "../generated/CryptoPunksMarket/CryptoPunksMarket";
import { TokenHolder } from "../generated/schema";

export function handleTransfer(event: Transfer): void {
  // let id = `${event.address}#${event.params.value}`;
  // let id = event.params.to.toHex() + event.params.value.toHex();
  let id = event.address.toHex() + '#' + event.params.value.toHex();
  log.info('crypto-punks handle transfer: id: {}, address: {}, tokenId: {}', [id, event.address.toString(), event.params.value.toString()]);

  let entity = TokenHolder.load(id)
  if (entity == null) {
    entity = new TokenHolder(id);
  }
  entity.contract = event.address;
  entity.tokenId = event.params.value;
  entity.owner = event.params.to;
  entity.save();
}
