import { log, BigInt } from '@graphprotocol/graph-ts';
import { TokenHolder } from "../generated/schema";
import {
  Transfer
} from '../generated/CryptoPunks/CryptoPunks';

export function handleTransfer(event: Transfer): void {
  let id = event.address.toHex() + '#' + event.params.value.toHex();

  log.info('[CryptoPunks] Handle transfer: id: {}, address: {}, tokenId: {}', [id, event.address.toString(), event.params.value.toString()]);

  let entity = TokenHolder.load(id);
  if (entity == null) {
    entity = new TokenHolder(id);
  }

  entity.contract = event.address;
  entity.tokenId = event.params.value;
  entity.owner = event.params.to;

  entity.save();
}
