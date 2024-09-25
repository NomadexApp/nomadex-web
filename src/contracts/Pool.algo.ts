import { ASA, DECIMALS, SCALE } from './pool/constants';
import { Pool0 } from './pool/Pool0.algo';

export class Pool extends Pool0 {
  createApplication(
    factory: AppID,
    manager: Address,
    name: StaticBytes<32>,
    symbol: StaticBytes<8>,
    alphaId: uint64,
    alphaType: uint8,
    betaId: uint64,
    betaType: uint8,
    swapFee: uint256,
  ): void {
    this.warden.value = manager;
    this.name.value = name;
    this.symbol.value = symbol;
    this.decimals.value = <uint8>DECIMALS;
    this.totalSupply.value = <uint256>SCALE * <uint256>(10 ** DECIMALS);
    this.initialized.value = false;

    this.factory.value = factory;
    this.alphaId.value = alphaId;
    this.betaId.value = betaId;
    this.alphaType.value = alphaType;
    this.betaType.value = betaType;
    this.swapFee.value = swapFee;
  }

  bootstrap(): void {
    assert(this.txn.sender === this.warden.value, 'only manager can call bootstrap');
    assert(this.initialized.value !== true, 'already initialized');
    this.initialized.value = true;
    this.balances(this.app.address).value = this.totalSupply.value;

    if (this.alphaType.value === ASA) {
      assert(this.transferAsaTo(this.app.address, <uint256>0, this.alphaId.value), 'optin failed');
    }
    if (this.betaType.value === ASA) {
      assert(this.transferAsaTo(this.app.address, <uint256>0, this.betaId.value), 'optin failed');
    }
  }
}
