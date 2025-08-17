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
      receiver: this.app.address,
      amount: { greaterThanEqualTo: 2 * globals.minBalance },
    });
    assert(this.txn.sender === this.warden.value, 'only manager can call bootstrap');
    assert(!this.initialized.value && !this.balances(this.txn.sender).exists, 'already initialized');
    this.initialized.value = true;
    this.balances(this.txn.sender).value = this.totalSupply.value;
    this.arc200_Transfer.log({
      from: globals.zeroAddress,
      to: this.txn.sender,
      value: this.totalSupply.value
    });
  }

  private asa_id(): AssetID {
    return AssetID.fromUint64(40266686);
  }

  arc200_exchange(): [uint64, Address] {
    return [this.asa_id().id, this.app.address];
  }

  post_update(): void {
    assert(this.txn.sender === this.warden.value, "manager only");
    sendAssetTransfer({
      xferAsset: this.asa_id(),
      sender: this.app.address,
      assetReceiver: this.app.address,
      assetAmount: 0,
      fee: 0
    });
  }

  // Redeem ASA for ARC-200
  arc200_redeem(amount: uint64): void {
    assert(this.txn.groupIndex > 0, "invalid group");
    verifyAssetTransferTxn(this.txnGroup[this.txn.groupIndex - 1], {
      xferAsset: this.asa_id(),
      sender: this.txn.sender,
      assetReceiver: this.app.address,
      assetAmount: { greaterThanEqualTo: amount },
      assetCloseTo: globals.zeroAddress,
      rekeyTo: globals.zeroAddress
    });
    this.transfer(this.app.address, this.txn.sender, amount as uint256);
  }

  // Swap ARC-200 back to ASA
  arc200_swapBack(amount: uint64): void {
    this.transfer(this.txn.sender, this.app.address, amount as uint256);
    sendAssetTransfer({
      xferAsset: this.asa_id(),
      sender: this.app.address,
      assetReceiver: this.txn.sender,
      assetAmount: amount,
      fee: 0
    });
  }
}
