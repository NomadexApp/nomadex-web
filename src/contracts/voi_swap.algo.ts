import { Contract } from '@algorandfoundation/tealscript';

const TOTAL_SUPPLY = 10_000_000_000_000_000;
const SCALE = 1000;
const FEE = 5;

// eslint-disable-next-line no-unused-vars
class VoiSwap extends Contract {

  governor = GlobalStateKey<Address>({ key: 'g' });

  poolToken = GlobalStateKey<Asset>({ key: 'p' });

  ratio = GlobalStateKey<uint64>({ key: 'r' });

  // custom <

  updateApplication(): void {
    verifyAppCallTxn(this.txn, { sender: this.governor.value });
    this.governor.value = this.txn.sender;
    return;
  }

  private getVoiBalance(address: Address): uint64 {
    return address.balance;
  }

  private getViaBalance(address: Address): uint<256> {
    return sendMethodCall<[Address], uint<256>>({
      sender: this.app.address,
      name: 'arc200_balanceOf',
      applicationID: Application.fromID(6779767),
      methodArgs: [address],
      fee: 1000,
    });
  }

  private transferVoiTo(to: Address, amount: uint64): boolean {
    sendPayment({
      sender: this.app.address,
      receiver: to,
      amount: amount,
      fee: 1000
    });
    return true;
  }

  private viaTransfer(to: Address, amount: uint<256>): boolean {
    return sendMethodCall<[Address, uint<256>], boolean>({
      sender: this.app.address,
      name: 'arc200_transfer',
      applicationID: Application.fromID(6779767),
      methodArgs: [to, amount],
      fee: 1000
    });
  }


  private viaTranferFrom(from: Address, to: Address, amount: uint<256>): boolean {
    return sendMethodCall<[Address, Address, uint<256>], boolean>({
      sender: this.app.address,
      name: 'arc200_transferFrom',
      applicationID: Application.fromID(6779767),
      methodArgs: [from, to, amount],
      fee: 1000
    });
  }

  // sendVia(): boolean {
  //   let amount1 = 1111;
  //   this.transferVoiTo(this.app.address, amount1);
  //   let amount2: uint<256> = 1111;
  //   return this.viaTransfer(this.app.address, amount2);
  // }

  // > custom

  createApplication(): void {
    this.governor.value = this.txn.sender;
  }

  private doCreatePoolToken(): Asset {
    // Unit name asserts not needed since it's done automatically by Asset.unitName

    return sendAssetCreation({
      configAssetName: 'LPT-VOI-VIA',
      configAssetUnitName: 'LPT',
      configAssetTotal: TOTAL_SUPPLY,
      configAssetDecimals: 6,
      configAssetManager: this.app.address,
      configAssetReserve: this.app.address,
      fee: 1000
    });
  }

  private doAxfer(receiver: Account, asset: Asset, amount: uint64): void {
    sendAssetTransfer({
      assetReceiver: receiver,
      xferAsset: asset,
      assetAmount: amount,
      fee: 1000,
    });
  }

  private tokensToMintIntial(aAmount: uint64, bAmount: uint64): uint64 {
    return sqrt(aAmount * bAmount);
  }

  private tokensToMint(issued: uint64, aSupply: uint64, bSupply: uint64, aAmount: uint64, bAmount: uint64): uint64 {
    const aRatio = wideRatio([aAmount, SCALE], [aSupply]);
    const bRatio = wideRatio([bAmount, SCALE], [bSupply]);

    const ratio = aRatio < bRatio ? aRatio : bRatio;

    return wideRatio([ratio, issued], [SCALE]);
  }

  private computeRatio(): uint64 {
    return wideRatio(
      [this.getVoiBalance(this.app.address), <uint64>SCALE],
      [<uint64>this.getViaBalance(this.app.address)]
    );
  }

  private tokensToBurn(issued: uint64, supply: uint64, amount: uint64): uint64 {
    return wideRatio([supply, amount], [issued]);
  }

  private tokensToSwap(inAmount: uint64, inSupply: uint64, outSupply: uint64): uint64 {
    const factor = SCALE - FEE;
    return wideRatio([inAmount, factor, outSupply], [inSupply * SCALE + inAmount * factor]);
  }

  private tokensForSwap(outAmount: uint64, inSupply: uint64, outSupply: uint64): uint64 {
    const factor = SCALE - FEE;
    return wideRatio([outAmount, outSupply, inSupply, SCALE], [outSupply, factor, outSupply - outAmount]);
  }

  set_governor(governor: Account): void {
    verifyAppCallTxn(this.txn, { sender: this.governor.value });
    this.governor.value = governor;
  }

  bootstrap(voiPayTxn: PayTxn, viaAmount: uint64): Asset {
    verifyAppCallTxn(this.txn, { sender: this.governor.value });

    assert(globals.groupSize > 1);
    assert(viaAmount >= voiPayTxn.amount);

    verifyPayTxn(voiPayTxn, { receiver: this.app.address, amount: { greaterThanEqualTo: 300_000 } });
    assert(this.viaTranferFrom(this.txn.sender, this.app.address, <uint<256>>viaAmount));

    if (!this.poolToken.exists) {
      this.poolToken.value = this.doCreatePoolToken();
    }

    return this.poolToken.value;
  }

  bootstrapStep2(optinTxn: AssetTransferTxn, poolAsset: Asset): void {
    verifyAppCallTxn(this.txn, { sender: this.governor.value });
    verifyAssetTransferTxn(optinTxn, { sender: this.txn.sender, xferAsset: poolAsset });

    assert(poolAsset === this.poolToken.value);
    assert(TOTAL_SUPPLY === this.app.address.assetBalance(poolAsset));

    const voiBalance = this.getVoiBalance(this.app.address);
    const viaBalance = this.getViaBalance(this.app.address);
    const toMint = this.tokensToMintIntial(voiBalance, <uint64>viaBalance);

    this.doAxfer(this.txn.sender, poolAsset, toMint);
  }

  bringOnline(selectionPK: bytes, stateProofPK: bytes, votePK: bytes, voteFirst: uint64, voteLast: uint64, voteKeyDilution: uint64): void {
    // verifyAppCallTxn(this.txn, { sender: this.governor.value });

    sendOnlineKeyRegistration({
      sender: this.app.address,
      selectionPK: selectionPK,
      stateProofPK: stateProofPK,
      votePK: votePK,
      voteFirst: voteFirst,
      voteLast: voteLast,
      voteKeyDilution: voteKeyDilution,
      fee: 1000,
    });
  }

  bringOffline(): void {
    // verifyAppCallTxn(this.txn, { sender: this.governor.value });

    sendOfflineKeyRegistration({
      sender: this.app.address,
      fee: 1000
    });
  }

  emergencyWithdraw(): void {
    verifyAppCallTxn(this.txn, { sender: this.governor.value });


    const viaBalance = this.getViaBalance(this.app.address);
    if (<uint64>viaBalance > 0) {
      assert(this.viaTransfer(this.governor.value, <uint<256>>viaBalance));
    }

    const voiBalance = this.getVoiBalance(this.app.address);
    const minBalance = (this.app.address.minBalance + 1000);
    if (voiBalance > minBalance) {
      assert(this.transferVoiTo(this.governor.value, this.getVoiBalance(this.app.address) - minBalance));
    }
  }

  mint(voiPayTxn: PayTxn, viaAmount: uint64, poolAsset: Asset): void {
    assert(globals.groupSize > 1);
    assert(poolAsset === this.poolToken.value);

    verifyPayTxn(voiPayTxn, {
      sender: this.txn.sender,
      amount: { greaterThan: 0 },
      receiver: this.app.address,
    });

    assert(this.viaTranferFrom(this.txn.sender, this.app.address, <uint<256>>viaAmount));

    if (
      this.getVoiBalance(this.app.address) === voiPayTxn.amount &&
      <uint64>this.getViaBalance(this.app.address) === viaAmount
    ) {
      this.tokensToMintIntial(voiPayTxn.amount, viaAmount);
    } else {
      const toMint = this.tokensToMint(
        TOTAL_SUPPLY - this.app.address.assetBalance(poolAsset),
        this.getVoiBalance(this.app.address) - voiPayTxn.amount,
        <uint64>this.getViaBalance(this.app.address) - viaAmount,
        voiPayTxn.amount,
        viaAmount
      );

      assert(toMint > 0);

      this.doAxfer(this.txn.sender, poolAsset, toMint);
    }
  }

  burn(poolXfer: AssetTransferTxn, poolAsset: Asset): void {
    assert(poolAsset === this.poolToken.value);

    verifyAssetTransferTxn(poolXfer, {
      sender: this.txn.sender,
      assetAmount: { greaterThan: 0 },
      assetReceiver: this.app.address,
      xferAsset: poolAsset,
    });

    const issued = TOTAL_SUPPLY - (this.app.address.assetBalance(poolAsset) - poolXfer.assetAmount);

    const aAmt = this.tokensToBurn(issued, this.getVoiBalance(this.app.address), poolXfer.assetAmount);

    const bAmt = this.tokensToBurn(issued, <uint64>this.getViaBalance(this.app.address), poolXfer.assetAmount);

    this.transferVoiTo(this.txn.sender, aAmt);
    this.viaTransfer(this.txn.sender, <uint<256>>bAmt);

    this.ratio.value = this.computeRatio();
  }

  swapVoiForVia(voiPayTxn: PayTxn, minVia: uint64): uint64 {
    verifyPayTxn(voiPayTxn, {
      amount: { greaterThan: 0 },
      receiver: this.app.address,
      sender: this.txn.sender,
    });

    const viaBalance = this.getViaBalance(this.app.address);

    const toSwap = this.tokensToSwap(
      voiPayTxn.amount,
      this.getVoiBalance(this.app.address) - voiPayTxn.amount,
      <uint64>viaBalance
    );

    assert(toSwap > 0);
    assert(toSwap >= minVia);

    this.viaTransfer(this.txn.sender, <uint<256>>toSwap);

    this.ratio.value = this.computeRatio();

    return toSwap;
  }

  simulateSwapVoiForVia(voiAmount: uint64): uint64 {
    const viaBalance = this.getViaBalance(this.app.address);
    return this.tokensToSwap(voiAmount, this.getVoiBalance(this.app.address), <uint64>viaBalance);
  }

  simulateSwapVoiForXVia(viaAmount: uint64): uint64 {
    const viaBalance = this.getViaBalance(this.app.address);
    return this.tokensForSwap(viaAmount, this.getVoiBalance(this.app.address), <uint64>viaBalance);
  }

  swapViaForVoi(viaAmount: uint64, minVoi: uint64): uint64 {
    assert(this.viaTranferFrom(this.txn.sender, this.app.address, <uint<256>>viaAmount));

    const toSwap = this.tokensToSwap(
      viaAmount,
      <uint64>this.getViaBalance(this.app.address) - viaAmount,
      this.getVoiBalance(this.app.address)
    );

    assert(toSwap > 0);
    assert(toSwap >= minVoi);

    this.transferVoiTo(this.txn.sender, toSwap);

    this.ratio.value = this.computeRatio();

    return toSwap;
  }

  simulateSwapViaForVoi(viaAmount: uint64): uint64 {
    const viaBalance = this.getViaBalance(this.app.address);
    return this.tokensToSwap(
      viaAmount,
      <uint64>viaBalance,
      this.getVoiBalance(this.app.address)
    );
  }

  simulateSwapViaForXVoi(voiAmount: uint64): uint64 {
    const viaBalance = this.getViaBalance(this.app.address);
    return this.tokensForSwap(
      voiAmount,
      <uint64>viaBalance,
      this.getVoiBalance(this.app.address)
    );
  }
}
