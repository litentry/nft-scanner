import { log, BigInt } from '@graphprotocol/graph-ts';
import { TokenHolder } from "../generated/schema";
import {
  Transfer
} from '../generated/MachineHallucinations_Mars_Lands_MACHINEHA/MachineHallucinations_Mars_Lands_MACHINEHA';

export function handleTransfer(event: Transfer): void {
  let id = event.address.toHex() + '#' + event.params.tokenId.toHex();

  log.info('[MachineHallucinations_Mars_Lands_MACHINEHA] Handle transfer: id: {}, address: {}, tokenId: {}', [id, event.address.toString(), event.params.tokenId.toString()]);

  let entity = TokenHolder.load(id);
  if (entity == null) {
    entity = new TokenHolder(id);
  }

  entity.contract = event.address;
  entity.tokenId = event.params.tokenId;
  entity.owner = event.params.to;

  entity.save();
}
