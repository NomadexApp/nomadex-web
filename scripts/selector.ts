import { sha512_256 } from 'js-sha512';

const methods = [
    'arc200_transfer(address,uint256)bool',
    'arc200_approve(address,uint256)bool',
    'arc200_Transfer(address,address,uint256)',
    'arc200_Approval(address,address,uint256)',
    'PoolCreated(uint64,uint64,uint8,uint64,uint8,uint256)',
    'PoolBootstrap(uint64)',
    'Swap(address,(uint256,uint256),(uint256,uint256),(uint256,uint256))',
    'Deposit(address,(uint256,uint256),uint256,(uint256,uint256))',
    'Withdraw(address,uint256,(uint256,uint256),(uint256,uint256))',
    'hasBalance(address)bool',
    'createBalanceBox(address)bool',
];

for (const signature of methods) {
    const hash = sha512_256(signature);
    const selHex = hash.slice(0, 8);
    const selector = Buffer.from(selHex, 'hex').toString('hex');
    console.log(signature, selector);
}