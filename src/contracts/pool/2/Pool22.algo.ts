import { ALGO, ASA, SMART } from '../constants';
import { Pool21 } from './Pool21.algo';

export abstract class Pool22 extends Pool21 {

  protected verifyDepositTxn(txn: Txn, assetType: uint8, assetId: uint64): uint256 {
    if (assetType === ALGO) {

      verifyTxn(txn, {
        typeEnum: TransactionType.Payment,
        sender: this.txn.sender,
        receiver: this.app.address,
        amount: { greaterThan: 0 },
        rekeyTo: globals.zeroAddress,
        closeRemainderTo: globals.zeroAddress,
      });

      return <uint256>txn.amount;

    } else if (assetType === ASA) {

      verifyTxn(txn, {
        typeEnum: TransactionType.AssetTransfer,
        xferAsset: AssetID.fromUint64(assetId),
        sender: this.txn.sender,
        assetReceiver: this.app.address,
        assetAmount: { greaterThan: 0 },
        rekeyTo: globals.zeroAddress,
        assetCloseTo: globals.zeroAddress,
      });

      return <uint256>txn.assetAmount;

    } else if (assetType === SMART) {

      verifyTxn(txn, {
        typeEnum: TransactionType.ApplicationCall,
        onCompletion: OnCompletion.NoOp,
        applicationID: AppID.fromUint64(assetId),
        sender: this.txn.sender,
        lastLog: hex('0x151f7c7580')
      });
      const amount: uint256 = castBytes<uint256>(txn.applicationArgs[2]);
      assert(txn.applicationArgs[0] === method('arc200_transfer(address,uint256)bool'));
      assert(txn.applicationArgs[1] === rawBytes(this.app.address));
      assert(amount > <uint256>0);

      return amount;
    }

    assert(0);
    return <uint256>0;
  }

  addLiquidity(alphaTxn: Txn, betaTxn: Txn): boolean {
    if (alphaTxn.typeEnum !== TransactionType.ApplicationCall) {
      this.extendBudget();
    }

    if (betaTxn.typeEnum !== TransactionType.ApplicationCall) {
      this.extendBudget();
    }

    const alphaAmount = this.verifyDepositTxn(alphaTxn, this.alphaType.value, this.alphaId.value);
    const betaAmount = this.verifyDepositTxn(betaTxn, this.betaType.value, this.betaId.value);

    assert(alphaAmount > <uint256>0 && betaAmount > <uint256>0);

    return this.handleAddLiquidity(alphaAmount, betaAmount);
  }
}
