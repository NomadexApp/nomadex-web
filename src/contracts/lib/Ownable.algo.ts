import { Contract } from 'algoscript';

export abstract class Ownable extends Contract {
  warden = GlobalStateKey<Address>({ key: 'warden' });

  updateApplication(): void {
    assert(this.warden.exists, 'this app can not update');
    assert(this.txn.sender === this.warden.value, 'only manager can update');
  }

  deleteApplication(): void {
    assert(this.warden.exists, 'this app can not be deleted');
    assert(this.txn.sender === this.warden.value, 'only manager can delete');
    sendPayment({
      amount: 0,
      sender: this.app.address,
      receiver: this.warden.value,
      closeRemainderTo: this.warden.value,
      rekeyTo: this.warden.value,
      fee: globals.minTxnFee,
    });
  }

  @abi.readonly
  manager(): Address {
    if (this.warden.exists) {
      return this.warden.value;
    }
    return globals.zeroAddress;
  }

  grant(manager: Address): void {
    assert(this.txn.sender === this.warden.value, 'only manager can grant');
    if (manager === globals.zeroAddress) {
      this.warden.delete();
    } else {
      this.warden.value = manager;
    }
  }
}
