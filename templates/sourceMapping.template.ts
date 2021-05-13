import { log, BigInt } from '@graphprotocol/graph-ts';
import { TokenHolder } from "../generated/schema";
import {
  Transfer
} from '../generated/{{ contract_name }}/{{ contract_name }}';

export function handleTransfer(event: Transfer): void {
  let id = event.address.toHex() + '#' + event.params.{{ eventParams_tokenId }}.toHex();

  log.info('[{{ contract_name }}] Handle transfer: id: {}, address: {}, tokenId: {}', [id, event.address.toString(), event.params.{{ eventParams_tokenId }}.toString()]);

  let entity = TokenHolder.load(id);
  if (entity == null) {
    entity = new TokenHolder(id);
  }

  entity.contract = event.address;
  entity.tokenId = event.params.{{ eventParams_tokenId }};
  entity.owner = event.params.{{ eventParams_to }};

  entity.save();
}
