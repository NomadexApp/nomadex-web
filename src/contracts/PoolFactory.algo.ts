import { Pool } from './Pool.algo';
import { Ownable } from './lib/Ownable.algo';
import { ASA } from './pool/constants';

export class PoolFactory extends Ownable {
  bootstrapFee = GlobalStateKey<uint64>({ key: 'bootstrap_fee' });

  platformFee = GlobalStateKey<uint256>({ key: 'platform_fee' });

  PoolCreated = new EventLogger<{
    poolId: AppID,
    alphaId: uint64,
    alphaType: uint8,
    betaId: uint64,
    betaType: uint8,
    swapFee: uint256
  }>();

  PoolBootstrap = new EventLogger<{
    poolId: AppID,
  }>();

  Withdraw = new EventLogger<{
    to: Address;
    amount: uint256,
    asaId: uint64,
    smartAssetId: uint64,
  }>();

  createApplication(): void {
    this.bootstrapFee.value = 2_000_000;
    this.platformFee.value = <uint256>1_000_000_000_000;
    this.warden.value = this.txn.sender;
  }

  createPool(
    payTxn: PayTxn,
    name: StaticBytes<32>,
    symbol: StaticBytes<8>,
    alphaId: uint64,
    alphaType: uint8,
    betaId: uint64,
    betaType: uint8,
    swapFee: uint256,
  ): uint64 {
    verifyPayTxn(payTxn, {
      sender: this.txn.sender,
      receiver: this.app.address,
      amount: { greaterThanEqualTo: this.bootstrapFee.value },
    });

    if (alphaType === ASA) {
      sendAssetTransfer({
        xferAsset: AssetID.fromUint64(alphaId),
        sender: this.app.address,
        assetReceiver: this.app.address,
        assetAmount: 0,
        fee: globals.minTxnFee
      });
    }
    if (betaType === ASA) {
      sendAssetTransfer({
        xferAsset: AssetID.fromUint64(betaId),
        sender: this.app.address,
        assetReceiver: this.app.address,
        assetAmount: 0,
        fee: globals.minTxnFee
      });
    }

    sendMethodCall<[AppID, Address, StaticBytes<32>, StaticBytes<8>, uint64, uint8, uint64, uint8, uint256], void>({
      name: 'createApplication',
      methodArgs: [
        this.app,
        this.app.address,
        name,
        symbol,
        alphaId,
        alphaType,
        betaId,
        betaType,
        swapFee,
      ],
      approvalProgram: Pool.approvalProgramPages(),
      clearStateProgram: Pool.clearProgram(),
      extraProgramPages: 3,
      localNumByteSlice: Pool.schema.local.numByteSlice,
      localNumUint: Pool.schema.local.numUint,
      globalNumByteSlice: Pool.schema.global.numByteSlice,
      globalNumUint: Pool.schema.global.numUint,
      fee: globals.minTxnFee
    });
    const poolId = this.itxn.createdApplicationID;

    sendPayment({
      sender: this.app.address,
      receiver: poolId.address,
      amount: globals.minBalance * 5 + globals.minTxnFee * 10,
      fee: globals.minTxnFee,
    });

    this.PoolCreated.log({
      poolId: poolId,
      alphaId: alphaId,
      alphaType: alphaType,
      betaId: betaId,
      betaType: betaType,
      swapFee: swapFee,
    });

    return poolId.id;
  }

  poolBootstrap(poolId: AppID): void {
    sendMethodCall<[], void>({
      name: 'bootstrap',
      methodArgs: [],
      sender: this.app.address,
      applicationID: poolId,
      fee: globals.minTxnFee,
    });

    this.PoolBootstrap.log({
      poolId: poolId,
    });
  }

  setFee(fee: uint64): boolean {
    assert(this.warden.value === this.txn.sender, "unauthorized");
    this.bootstrapFee.value = fee;
    return true;
  }

  setPlatformFee(fee: uint256): boolean {
    assert(this.warden.value === this.txn.sender, "unauthorized");
    this.platformFee.value = fee;
    return true;
  }

  setPoolManager(poolId: AppID, manager: Address): void {
    assert(this.warden.value === this.txn.sender, "unauthorized");
    sendMethodCall<[Address], void>({
      name: 'grant',
      methodArgs: [manager],
      sender: this.app.address,
      applicationID: poolId,
      fee: globals.minTxnFee
    });
  }

  setPoolFee(poolId: AppID, fee: uint256): void {
    assert(this.warden.value === this.txn.sender, "unauthorized");
    sendMethodCall<[uint256], boolean>({
      name: 'setFees',
      methodArgs: [fee],
      sender: this.app.address,
      applicationID: poolId,
      fee: globals.minTxnFee
    });
  }

  withdraw(to: Address, amount: uint256, id: [uint64, uint64]): void {
    assert(this.txn.sender === this.warden.value, "unauthorized");
    if (id[0] > 0) {
      sendAssetTransfer({
        xferAsset: AssetID.fromUint64(id[0]),
        sender: this.app.address,
        assetReceiver: to,
        assetAmount: <uint64>amount,
        fee: globals.minTxnFee,
      });
    } else if (id[1] > 0) {
      sendMethodCall<[Address, uint256], uint256>({
        applicationID: AppID.fromUint64(id[1]),
        sender: this.app.address,
        name: 'arc200_transfer',
        methodArgs: [to, amount],
        fee: globals.minTxnFee,
      });
    } else {
      sendPayment({
        sender: this.app.address,
        receiver: to,
        amount: <uint64>amount,
        fee: globals.minTxnFee,
      });
    }
    this.Withdraw.log({
      to: to,
      amount: amount,
      asaId: id[0],
      smartAssetId: id[1]
    });
  }

  noop(_n: uint64): void {
    // 
  }
}
