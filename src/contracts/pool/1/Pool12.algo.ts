import { ALGO, ASA, SMART } from '../constants';
import { Pool11 } from './Pool11.algo';

export abstract class Pool12 extends Pool11 {
    protected getAlgoBalance(address: Address): uint256 {
        return <uint256>(address.balance - address.minBalance);
    }

    protected getAsaBalance(address: Address, assetId: uint64): uint256 {
        return <uint256>address.assetBalance(assetId);
    }

    protected getSmartAssetBalance(address: Address, assetId: uint64): uint256 {
        return sendMethodCall<[Address], uint256>({
            sender: this.app.address,
            name: 'arc200_balanceOf',
            applicationID: AppID.fromUint64(assetId),
            methodArgs: [address],
            fee: globals.minTxnFee,
        });
    }

    protected transferAlgoTo(to: Address, amount: uint256): boolean {
        sendPayment({
            sender: this.app.address,
            receiver: to,
            amount: <uint64>amount,
            fee: globals.minTxnFee,
        });
        return true;
    }

    protected transferAsaTo(to: Address, amount: uint256, assetId: uint64): boolean {
        sendAssetTransfer({
            sender: this.app.address,
            assetAmount: <uint64>amount,
            assetReceiver: to,
            xferAsset: AssetID.fromUint64(assetId),
            fee: globals.minTxnFee,
        });
        return true;
    }

    protected transferSmartAssetTo(to: Address, amount: uint256, assetId: uint64): boolean {
        return sendMethodCall<[Address, uint256], boolean>({
            sender: this.app.address,
            name: 'arc200_transfer',
            applicationID: AppID.fromUint64(assetId),
            methodArgs: [to, amount],
            fee: globals.minTxnFee,
        });
    }

    protected transferSmartAssetFrom(from: Address, to: Address, amount: uint256, assetId: uint64): boolean {
        return sendMethodCall<[Address, Address, uint256], boolean>({
            sender: this.app.address,
            name: 'arc200_transferFrom',
            applicationID: AppID.fromUint64(assetId),
            methodArgs: [from, to, amount],
            fee: globals.minTxnFee,
        });
    }

    protected getBalance(type: uint8, assetId: uint64): uint256 {
        if (ALGO === type) return <uint256>(this.app.address.balance - this.app.address.minBalance);
        if (ASA === type) return <uint256>this.app.address.assetBalance(assetId);
        if (SMART === type)
            return sendMethodCall<[Address], uint256>({
                sender: this.app.address,
                name: 'arc200_balanceOf',
                applicationID: AppID.fromUint64(assetId),
                methodArgs: [this.app.address],
                fee: globals.minTxnFee,
            });

        return <uint256>0;
    }

    protected getDecimals(type: uint8, assetId: uint64): uint8 {
        if (ALGO === type) return <uint8>6;
        if (ASA === type) return <uint8>AssetID.fromUint64(assetId).decimals;
        if (SMART === type)
            return sendMethodCall<[], uint8>({
                sender: this.app.address,
                name: 'arc200_decimals',
                applicationID: AppID.fromUint64(assetId),
                methodArgs: [],
                fee: globals.minTxnFee,
            });
        return <uint8>0;
    }

    protected alphaBalance(): uint256 {
        return this.getBalance(this.alphaType.value, this.alphaId.value);
    }

    protected betaBalance(): uint256 {
        return this.getBalance(this.betaType.value, this.betaId.value);
    }

    protected alphaDecimals(): uint8 {
        return this.getDecimals(this.alphaType.value, this.alphaId.value);
    }

    protected betaDecimals(): uint8 {
        return this.getDecimals(this.betaType.value, this.betaId.value);
    }

    protected alphaTransfer(to: Address, amount: uint256): boolean {
        if (this.alphaType.value === ALGO) {
            return this.transferAlgoTo(to, amount);
        }
        if (this.alphaType.value === ASA) {
            return this.transferAsaTo(to, amount, this.alphaId.value);
        }
        if (this.alphaType.value === SMART) {
            return this.transferSmartAssetTo(to, amount, this.alphaId.value);
        }
        return false;
    }

    protected betaTransfer(to: Address, amount: uint256): boolean {
        if (this.betaType.value === ALGO) {
            return this.transferAlgoTo(to, amount);
        }
        if (this.betaType.value === ASA) {
            return this.transferAsaTo(to, amount, this.betaId.value);
        }
        if (this.betaType.value === SMART) {
            return this.transferSmartAssetTo(to, amount, this.betaId.value);
        }
        return false;
    }

    protected extendBudget(): void {
        sendMethodCall<[uint64], void>({
            name: 'noop',
            methodArgs: [0],
            sender: this.app.address,
            applicationID: this.factory.value,
            fee: globals.minTxnFee
        });
    }
}
