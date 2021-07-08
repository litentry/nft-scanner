import { log, BigInt } from '@graphprotocol/graph-ts';
import { TokenHolder } from "../generated/schema";
import {
  TransferSingle,
} from '../generated/Polkapet/Polkapet';

export function handleTransferSingle(event: TransferSingle): void {
  let id = event.address.toHex() + '#' + event.params.id.toHex();

  log.info('[AVASTARToken] Handle transfer: id: {}, address: {}, tokenId: {}, value: {}', [id, event.address.toString(), event.params.id.toString(), event.params.value.toString()]);

  let entity = TokenHolder.load(id);
  if (entity == null) {
    entity = new TokenHolder(id);
  }

  entity.contract = event.address;
  entity.tokenId = event.params.id;
  entity.owner = event.params.to;

  entity.save();
}
