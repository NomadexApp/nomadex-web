import { Contract } from 'algoscript';
import { Arc200 } from '../../lib/Arc200.algo';
import { Ownable } from '../../lib/Ownable.algo';

export abstract class Pool11 extends Contract.extend(Arc200, Ownable) {

  factory = GlobalStateKey<AppID>({ key: 'factory' });

  alphaId = GlobalStateKey<uint64>({ key: 'alpha_id' });

  betaId = GlobalStateKey<uint64>({ key: 'beta_id' });

  alphaType = GlobalStateKey<uint8>({ key: 'alpha_type' });

  betaType = GlobalStateKey<uint8>({ key: 'beta_type' });

  swapFee = GlobalStateKey<uint256>({ key: 'swap_fee' });

  Swap = new EventLogger<{
    sender: Address;
    inAmts: [uint256, uint256];
    outAmts: [uint256, uint256];
    poolBals: [uint256, uint256];
  }>();

  Deposit = new EventLogger<{
    sender: Address;
    inAmts: [uint256, uint256];
    outLpt: uint256;
    poolBals: [uint256, uint256];
  }>();

  Withdraw = new EventLogger<{
    sender: Address;
    inLpt: uint256;
    outAmts: [uint256, uint256];
    poolBals: [uint256, uint256];
  }>();

  setFees(fee: uint256): boolean {
    assert(this.warden.value === this.txn.sender);
    this.swapFee.value = fee;
    return true;
  }
}
