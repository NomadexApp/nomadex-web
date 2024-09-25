import { Contract } from 'algoscript';
import { Arc200 } from './lib/Arc200.algo';
import { Ownable } from './lib/Ownable.algo';

export class SmartAsset extends Contract.extend(Arc200, Ownable) {
  createApplication(
    manager: Address,
    name: StaticBytes<32>,
    symbol: StaticBytes<8>,
    decimals: uint8,
    totalSupply: uint256
  ): void {
    this.warden.value = manager;
    this.name.value = name;
    this.symbol.value = symbol;
    this.decimals.value = decimals;
    this.totalSupply.value = totalSupply;
    this.initialized.value = false;
  }

  bootstrap(txn: PayTxn): void {
    verifyPayTxn(txn, {
      sender: this.txn.sender,
      receiver: this.app.address,
      amount: { greaterThanEqualTo: 2 * globals.minBalance },
      closeRemainderTo: globals.zeroAddress,
      rekeyTo: globals.zeroAddress,
    });
    assert(this.txn.sender === this.warden.value, 'only manager can call bootstrap');
    assert(!this.initialized.value && !this.balances(this.txn.sender).exists, 'already initialized');
    this.initialized.value = true;
    this.balances(this.txn.sender).value = this.totalSupply.value;
  }
}
