import { Pool2 } from '../2/Pool2.algo';
import { SCALE } from '../constants';

export abstract class Pool31 extends Pool2 {

  protected computeOutTokens(alphaAmount: uint256, alphaSupply: uint256, betaSupply: uint256, fee: uint256): uint256 {
    const factor = <uint256>SCALE - fee;

    const numerator = <uint<512>>alphaAmount * <uint<512>>betaSupply * <uint<512>>factor;
    const denominator = (<uint<512>>alphaAmount + <uint<512>>alphaSupply) * <uint<512>>SCALE;

    return <uint256>(numerator / denominator);
  }

  protected handleSwapAlphaToBeta(alphaAmount: uint256, minBetaAmount: uint256): uint256 {
    const alphaBalance: uint256 = this.alphaBalance();
    const betaBalance: uint256 = this.betaBalance();
    assert(alphaBalance > 0);
    assert(betaBalance > minBetaAmount);

    const platformFee = this.factory.value.globalState('platform_fee') as uint256;
    const amountOut: uint256 = this.computeOutTokens(
      alphaAmount,
      alphaBalance - alphaAmount,
      betaBalance,
      this.swapFee.value + platformFee
    );
    const amountWOPFee: uint256 = this.computeOutTokens(
      alphaAmount,
      alphaBalance - alphaAmount,
      betaBalance,
      this.swapFee.value
    );
    const platformFeeAmt = <uint256>(<uint256>amountWOPFee - <uint256>amountOut);
    assert(amountOut >= minBetaAmount);
    assert(amountOut < betaBalance);
    assert(this.betaTransfer(this.txn.sender, amountOut));
    assert(this.betaTransfer(this.factory.value.address, platformFeeAmt));
    this.Swap.log({
      sender: this.txn.sender,
      inAmts: [alphaAmount, 0],
      outAmts: [0, amountOut],
      poolBals: [alphaBalance, <uint256>(betaBalance - amountWOPFee)],
    });
    return amountOut;
  }

  protected handleSwapBetaToAlpha(betaAmount: uint256, minAlphaAmount: uint256): uint256 {
    const alphaBalance: uint256 = this.alphaBalance();
    const betaBalance: uint256 = this.betaBalance();
    assert(alphaBalance > minAlphaAmount);
    assert(betaBalance > 0);

    const platformFee = this.factory.value.globalState('platform_fee') as uint256;
    const amountOut: uint256 = this.computeOutTokens(
      betaAmount,
      betaBalance - betaAmount,
      alphaBalance,
      this.swapFee.value + platformFee
    );
    const amountWOPFee: uint256 = this.computeOutTokens(
      betaAmount,
      betaBalance - betaAmount,
      alphaBalance,
      this.swapFee.value
    );
    const platformFeeAmt = <uint256>(<uint256>amountWOPFee - <uint256>amountOut);
    assert(amountOut >= minAlphaAmount);
    assert(amountOut < alphaBalance);
    assert(this.alphaTransfer(this.txn.sender, amountOut));
    assert(this.alphaTransfer(this.factory.value.address, platformFeeAmt));
    this.Swap.log({
      sender: this.txn.sender,
      inAmts: [0, betaAmount],
      outAmts: [amountOut, 0],
      poolBals: [<uint256>(alphaBalance - amountWOPFee), betaBalance],
    });
    return amountOut;
  }
}
