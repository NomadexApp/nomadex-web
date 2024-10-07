import { ALGO, DECIMALS, SCALE } from '../constants';
import { Pool1 } from '../1/Pool1.algo';

export abstract class Pool21 extends Pool1 {
  protected powOfTen(pow: uint64): uint256 {
    let result: uint256 = 1;

    for (let i: uint64 = 0; i < pow; i = i + 1) {
      result = result * <uint256>10;
    }

    return result;
  }

  protected handleAddLiquidity(alphaAmount: uint256, betaAmount: uint256): boolean {
    assert(alphaAmount > 0 && betaAmount > 0, 'atleast one amount is zero');

    const alphaBalance = this.alphaBalance();
    const betaBalance = this.betaBalance();
    const issuedLptBefore = this.totalSupply.value - this.arc200_balanceOf(this.app.address);
    let lptToMint = <uint256>0;

    if (issuedLptBefore === <uint256>0) {
      const alphaDecimals = this.alphaDecimals();
      const betaDecimals = this.betaDecimals();

      const alphaNormalized = (alphaAmount * this.powOfTen(DECIMALS)) / this.powOfTen(<uint64>alphaDecimals);
      const betaNormalized = (betaAmount * this.powOfTen(DECIMALS)) / this.powOfTen(<uint64>betaDecimals);

      lptToMint = sqrt(alphaNormalized * betaNormalized);
    } else {
      const ratioAlpha = (alphaAmount * <uint256>SCALE) / (alphaBalance - alphaAmount);
      const ratioBeta = (betaAmount * <uint256>SCALE) / (betaBalance - betaAmount);
      const ratio = ratioAlpha < ratioBeta ? ratioAlpha : ratioBeta;

      lptToMint = (issuedLptBefore * ratio) / <uint256>SCALE;
    }

    assert(lptToMint > <uint256>0);
    assert(this.transfer(this.app.address, this.txn.sender, lptToMint));

    this.Deposit.log({
      sender: this.txn.sender,
      inAmts: [alphaAmount, betaAmount],
      outLpt: lptToMint,
      poolBals: [alphaBalance, betaBalance],
    });

    return true;
  }

  removeLiquidity(lptAmount: uint256): boolean {
    let alphaBalance: uint256 = this.alphaBalance();
    let betaBalance: uint256 = this.betaBalance();

    assert(alphaBalance > <uint256>0 && betaBalance > <uint256>0, 'at least one amount is zero');

    const txnFees = <uint256>(4 * globals.minTxnFee);
    if (this.alphaType.value === ALGO) {
      alphaBalance = alphaBalance - txnFees;
    } else if (this.betaType.value === ALGO) {
      betaBalance = betaBalance - txnFees;
    }

    const issuedLptBefore: uint256 = this.totalSupply.value - this.arc200_balanceOf(this.app.address);
    const withdrawAlpha: uint256 = (alphaBalance * lptAmount) / issuedLptBefore;
    const withdrawBeta: uint256 = (betaBalance * lptAmount) / issuedLptBefore;

    assert(withdrawAlpha > 0 && withdrawBeta > 0, 'at least one withdrawal amount is zero');

    assert(this.transfer(this.txn.sender, this.app.address, lptAmount));

    assert(this.alphaTransfer(this.txn.sender, withdrawAlpha));
    assert(this.betaTransfer(this.txn.sender, withdrawBeta));

    const finalBalanceX: uint256 = alphaBalance - withdrawAlpha;
    const finalBalanceY: uint256 = betaBalance - withdrawBeta;

    this.Withdraw.log({
      sender: this.txn.sender,
      inLpt: lptAmount,
      outAmts: [withdrawAlpha, withdrawBeta],
      poolBals: [finalBalanceX, finalBalanceY],
    });

    return true;
  }
}
