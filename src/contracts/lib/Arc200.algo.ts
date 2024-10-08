import { Contract } from 'algoscript';

const NOT_ENOUGH_BALANCE = 'not enough balance';
const ALLOWANCE_INSUFFICIENT = "can't spend more than allowed";
const EMPTY_WALLET = 'empty wallet, must hold minBalance';

export abstract class Arc200 extends Contract {
  name = GlobalStateKey<StaticBytes<32>>({ key: 'name' });

  symbol = GlobalStateKey<StaticBytes<8>>({ key: 'symbol' });

  decimals = GlobalStateKey<uint8>({ key: 'decimals' });

  totalSupply = GlobalStateKey<uint256>({ key: 'total_supply' });

  initialized = GlobalStateKey<boolean>({ key: 'initialized' });

  balances = BoxMap<Address, uint256>();

  allowances = BoxMap<[Address, Address], uint256>();

  @abi.readonly
  arc200_name(): StaticBytes<32> {
    return this.name.value;
  }

  @abi.readonly
  arc200_symbol(): StaticBytes<8> {
    return this.symbol.value;
  }

  @abi.readonly
  arc200_decimals(): uint8 {
    return this.decimals.value;
  }

  @abi.readonly
  arc200_totalSupply(): uint256 {
    return this.totalSupply.value;
  }

  @abi.readonly
  arc200_balanceOf(owner: Address): uint256 {
    if (this.balances(owner).exists) {
      return this.balances(owner).value;
    }
    return <uint256>0;
  }

  @abi.readonly
  arc200_allowance(owner: Address, spender: Address): uint256 {
    if (this.allowances([owner, spender]).exists) {
      return this.allowances([owner, spender]).value;
    }
    return <uint256>0;
  }

  arc200_Transfer = new EventLogger<{ from: Address; to: Address; value: uint256 }>();

  arc200_Approval = new EventLogger<{ owner: Address; spender: Address; value: uint256 }>();

  protected transfer(from: Address, to: Address, value: uint256): boolean {
    if (!this.balances(from).exists && from.balance >= globals.minBalance) {
      this.balances(from).value = <uint256>0;
    }
    if (!this.balances(to).exists && to.balance >= globals.minBalance) {
      this.balances(to).value = <uint256>0;
    }

    assert(this.balances(from).exists, NOT_ENOUGH_BALANCE);
    assert(this.balances(to).exists, EMPTY_WALLET);

    const senderBalance = this.balances(from).value;
    assert(senderBalance >= value, NOT_ENOUGH_BALANCE);

    this.balances(from).value = senderBalance - value;
    this.balances(to).value = this.balances(to).value + value;

    this.arc200_Transfer.log({ from: from, to: to, value: value });

    return true;
  }

  arc200_transfer(to: Address, value: uint256): boolean {
    return this.transfer(this.txn.sender, to, value);
  }

  protected approve(owner: Address, spender: Address, value: uint256): boolean {
    assert(this.allowances([owner, spender]).exists || spender.balance >= globals.minBalance, EMPTY_WALLET);

    this.allowances([owner, spender]).value = value;
    this.arc200_Approval.log({ owner: owner, spender: spender, value: value });

    return true;
  }

  arc200_approve(spender: Address, value: uint256): boolean {
    return this.approve(this.txn.sender, spender, value);
  }

  arc200_transferFrom(from: Address, to: Address, value: uint256): boolean {
    if (value === 0) return true;

    const allowance = this.arc200_allowance(from, this.txn.sender);
    assert(allowance >= value, ALLOWANCE_INSUFFICIENT);

    const ownerBalance = this.arc200_balanceOf(from);
    assert(ownerBalance >= value, NOT_ENOUGH_BALANCE);

    this.allowances([from, this.txn.sender]).value = allowance - value;
    this.balances(from).value = ownerBalance - value;
    this.balances(to).value = this.arc200_balanceOf(to) + value;

    this.arc200_Transfer.log({ from: from, to: to, value: value });

    return true;
  }

  @abi.readonly
  supportsInterface(interfaceID: StaticArray<byte, 4>): boolean {
    const id = btoi(interfaceID);

    return (
      id === 0x4e22a3ba ||
      id === 0xc7bea040 ||
      id === 0xda7025b9 ||
      id === 0x4a968f8f ||
      id === 0xb5422125 ||
      id === 0x657d13ec ||
      id === 0xb6ae1a25 ||
      id === 0x84ec13d5 ||
      id === 0xec996041 ||
      id === 0x82e573c4 ||
      id === 0xbbb319f3 ||
      id === 0x7983c35c ||
      id === 0x1969f865 ||
      id === 0xbc4a5400 ||
      id === 0xc98dd055 ||
      id === 0x663042fb
    );
  }

  @abi.readonly
  zeroAddress(): Address {
    return globals.zeroAddress;
  }

  @abi.readonly
  hasBox(owner: Address, spender: Address): boolean {
    if (spender === globals.zeroAddress) {
      return this.balances(owner).exists;
    }
    return this.allowances([owner, spender]).exists;
  }

  createBalanceBox(owner: Address): boolean {
    if (!this.balances(owner).exists) {
      this.balances(owner).value = <uint256>0;
    }
    return true;
  }

  createAllowanceBox(owner: Address, spender: Address): boolean {
    if (!this.allowances([owner, spender]).exists) {
      this.allowances([owner, spender]).value = <uint256>0;
    }
    return true;
  }

  noop(_n: uint64): void {
    // 
  }
}
