import { Pool31 } from './Pool31.algo';

export abstract class Pool32 extends Pool31 {

  swapAlphaToBeta(alphaTxn: Txn, minBetaAmount: uint256): uint256 {
    if (alphaTxn.typeEnum !== TransactionType.ApplicationCall) this.extendBudget();
    const alphaAmount = this.verifyDepositTxn(alphaTxn, this.alphaType.value, this.alphaId.value);

    return this.handleSwapAlphaToBeta(alphaAmount, minBetaAmount);
  }

  swapBetaToAlpha(betaTxn: Txn, minAlphaAmount: uint256): uint256 {
    if (betaTxn.typeEnum !== TransactionType.ApplicationCall) this.extendBudget();
    const betaAmount = this.verifyDepositTxn(betaTxn, this.betaType.value, this.betaId.value);

    return this.handleSwapBetaToAlpha(betaAmount, minAlphaAmount);
  }
}
