import { Arc200Token } from './Arc200Token.algo';

const SCALE = 100_000_000_000_000;
const INITIAL_FEE = 1_000_000_000_000;
const INITIAL_MANAGER_FEE = 50_000_000_000_000;
const DECIMALS = 6;

export class AlgoArc200PoolV02 extends Arc200Token {

    feeController = GlobalStateKey<Address>({ key: 'fee_controller' });

    fee = BoxKey<{
        swapFee: uint256,
        platformFee: uint256,
    }>({ key: 'fee' });

    tokenYAppId = BoxKey<Application>({ key: 'token_y_app_id' });

    /**
     * @param directionBtoA false if a -> b and true if b -> a
     */
    Swap = new EventLogger<{
        sender: Address,
        amountX: uint256,
        amountY: uint256,
        directionYtoX: boolean
    }>();

    AddLiquidity = new EventLogger<{
        sender: Address,
        amountX: uint256,
        amountY: uint256,
        lptAmount: uint256
    }>();

    RemoveLiquidity = new EventLogger<{
        sender: Address,
        amountX: uint256,
        amountY: uint256,
        lptAmount: uint256
    }>();

    poolInitialize(name: StaticArray<byte, 32>, symbol: StaticArray<byte, 8>, tokenYAppId: Application): void {
        assert(this.app.creator === this.txn.sender || this.manager.value === this.txn.sender);
        assert(!this.totalSupply.exists);

        this.arc200Initialize(
            name,
            symbol,
            <uint8>DECIMALS,
            (<uint256>SCALE * <uint256>(10 ** DECIMALS)),
            this.app.address
        );

        this.feeController.value = this.txn.sender;
        this.fee.value = {
            swapFee: <uint256>INITIAL_FEE,
            platformFee: <uint256>INITIAL_MANAGER_FEE
        };
        this.tokenYAppId.value = tokenYAppId;
    }

    setFeeController(feeController: Address): boolean {
        assert(this.manager.value === this.txn.sender || this.feeController.value === this.txn.sender);
        this.feeController.value = feeController;
        return true;
    }

    setFees(fee: uint256): boolean {
        assert(this.feeController.value === this.txn.sender);
        this.fee.value = {
            swapFee: fee,
            platformFee: this.fee.value.platformFee
        };
        return true;
    }

    setPlatformFees(fee: uint256): boolean {
        assert(this.manager.value === this.txn.sender);
        this.fee.value = {
            swapFee: this.fee.value.swapFee,
            platformFee: fee
        };
        return true;
    }

    registerOnline(selectionPk: bytes, stateProofPk: bytes, votePk: bytes, voteFirst: uint64, voteLast: uint64, voteKeyDilution: uint64): void {
        assert(this.txn.sender === this.manager.value);

        sendOnlineKeyRegistration({
            sender: this.app.address,
            selectionPK: selectionPk,
            stateProofPK: stateProofPk,
            votePK: votePk,
            voteFirst: voteFirst,
            voteLast: voteLast,
            voteKeyDilution: voteKeyDilution,
            fee: globals.minTxnFee,
        });
    }

    registerOffline(): void {
        assert(this.txn.sender === this.manager.value);

        sendOfflineKeyRegistration({
            sender: this.app.address,
            fee: globals.minTxnFee
        });
    }

    private getTokenXBalance(): uint256 {
        return <uint256>(this.app.address.balance - this.app.address.minBalance);
    }

    private getTokenYBalance(): uint256 {
        return sendMethodCall<[Address], uint256>({
            sender: this.app.address,
            name: 'arc200_balanceOf',
            applicationID: this.tokenYAppId.value,
            methodArgs: [this.app.address],
            fee: globals.minTxnFee,
        });
    }

    private getTokenXDecimals(): uint8 {
        return <uint8>6;
    }

    private getTokenYDecimals(): uint8 {
        return sendMethodCall<[], uint8>({
            sender: this.app.address,
            name: 'arc200_decimals',
            applicationID: this.tokenYAppId.value,
            methodArgs: [],
            fee: globals.minTxnFee,
        });
    }

    private transferXTo(to: Address, amount: uint256): boolean {
        sendPayment({
            sender: this.app.address,
            receiver: to,
            amount: <uint64>amount,
            fee: globals.minTxnFee
        });
        return true;
    }

    private transferYTo(to: Address, amount: uint256): boolean {
        return sendMethodCall<[Address, uint256], boolean>({
            sender: this.app.address,
            name: 'arc200_transfer',
            applicationID: this.tokenYAppId.value,
            methodArgs: [to, amount],
            fee: globals.minTxnFee
        });
    }

    private transferYFrom(from: Address, to: Address, amount: uint256): boolean {
        return sendMethodCall<[Address, Address, uint256], boolean>({
            sender: this.app.address,
            name: 'arc200_transferFrom',
            applicationID: this.tokenYAppId.value,
            methodArgs: [from, to, amount],
            fee: globals.minTxnFee
        });
    }

    @abi.readonly
    ratio(): uint256 {
        return (this.getTokenXBalance() * <uint256>SCALE) / this.getTokenYBalance();
    }

    /**
     * Example: `getDecimalPlaces(6)` returns `1,000,000`
     * @param pow number of decimal places
     * @returns 
     */
    private getDecimalPlaces(decimals: uint64): uint256 {
        let result: uint256 = 1;

        for (let i = 0; i < decimals; i = i + 1) {
            result = result * <uint256>10;
        }

        return result;
    }

    addLiquidity(payTxnX: PayTxn, amountY: uint256): boolean {
        verifyPayTxn(payTxnX, {
            sender: this.txn.sender,
            receiver: this.app.address,
            amount: { greaterThan: 0 },
            rekeyTo: globals.zeroAddress,
            closeRemainderTo: globals.zeroAddress
        });

        const amountX = <uint256>payTxnX.amount;

        assert(amountY > <uint256>0);

        const balanceY = this.getTokenYBalance();
        const balanceX = this.getTokenXBalance();
        const issuedLptBefore = this.totalSupply.value - this.arc200_balanceOf(this.app.address);

        if (balanceY > <uint256>0 && balanceX > <uint256>0 && issuedLptBefore > <uint256>0) {
            const liqudityRatioBefore = (((balanceX - amountX) * <uint256>SCALE) / balanceY);
            const liqudityRatioOfCurrentTxn = ((amountX * <uint256>SCALE) / amountY);
            const ratioDivergenceAllowed = (liqudityRatioBefore / <uint256>40); // 2.5%

            assert((liqudityRatioBefore - ratioDivergenceAllowed) < liqudityRatioOfCurrentTxn);
            assert(liqudityRatioOfCurrentTxn < (liqudityRatioBefore + ratioDivergenceAllowed));
        }

        assert(this.transferYFrom(this.txn.sender, this.app.address, amountY));

        let lptToMint = <uint256>0;

        if (issuedLptBefore === <uint256>0) {

            const decimalsOfX = this.getTokenXDecimals();
            const decimalsOfY = this.getTokenYDecimals();

            const amountXNormalized = (amountX * (this.getDecimalPlaces(<uint64>DECIMALS))) / this.getDecimalPlaces(<uint64>decimalsOfX);
            const amountYNormalized = (amountY * (this.getDecimalPlaces(<uint64>DECIMALS))) / this.getDecimalPlaces(<uint64>decimalsOfY);

            lptToMint = sqrt(amountXNormalized * amountYNormalized);

        } else {
            const ratioX = (amountX * <uint256>SCALE) / (balanceX - amountX);
            const ratioY = (amountY * <uint256>SCALE) / balanceY;
            const ratio = ratioX < ratioY ? ratioX : ratioY;

            lptToMint = (issuedLptBefore * ratio) / <uint256>SCALE;
        }

        assert(lptToMint > <uint256>0);
        assert(this.transfer(this.app.address, this.txn.sender, lptToMint));

        this.AddLiquidity.log(
            {
                sender: this.txn.sender,
                amountX: amountX,
                amountY: amountY,
                lptAmount: lptToMint
            }
        );

        return true;
    }

    removeLiquidity(lptAmount: uint256): boolean {
        const balanceY = this.getTokenYBalance();
        const balanceX = this.getTokenXBalance();

        assert(balanceX > <uint256>0);
        assert(balanceY > <uint256>0);

        const issuedLptBefore = this.totalSupply.value - this.arc200_balanceOf(this.app.address);
        const withdrawAmountX = (balanceX * lptAmount) / issuedLptBefore;
        const withdrawAmountY = (balanceY * lptAmount) / issuedLptBefore;

        assert(withdrawAmountX > <uint256>0);
        assert(withdrawAmountY > <uint256>0);

        assert(this.transfer(this.txn.sender, this.app.address, lptAmount));
        assert(this.transferXTo(this.txn.sender, withdrawAmountX));
        assert(this.transferYTo(this.txn.sender, withdrawAmountY));

        this.RemoveLiquidity.log(
            {
                sender: this.txn.sender,
                amountX: withdrawAmountX,
                amountY: withdrawAmountY,
                lptAmount: lptAmount
            }
        );

        return true;
    }

    private computeOutTokens(amountA: uint256, supplyA: uint256, supplyB: uint256, fee: uint256): uint256 {
        const factor = <uint256>SCALE - fee;

        const numerator = (
            <uint<512>>amountA * <uint<512>>supplyB * <uint<512>>factor
        );
        const denominator = (
            (<uint<512>>amountA + <uint<512>>supplyA) * <uint<512>>SCALE
        );

        return <uint256>(numerator / denominator);
    }

    private computePlatformFee(amountA: uint256, supplyA: uint256, supplyB: uint256): uint256 {
        const amount_without_fee = this.computeOutTokens(amountA, supplyA, supplyB, 0);
        const amount_with_fee = this.computeOutTokens(amountA, supplyA, supplyB, this.fee.value.swapFee);

        return ((amount_without_fee - amount_with_fee) * this.fee.value.platformFee) / <uint256>SCALE;
    }

    swapXtoY(payTxnX: PayTxn, minAmountY: uint256): uint256 {
        verifyPayTxn(payTxnX, {
            sender: this.txn.sender,
            receiver: this.app.address,
            amount: { greaterThan: 0 },
            rekeyTo: globals.zeroAddress,
            closeRemainderTo: globals.zeroAddress,
        });

        const amountX = <uint256>payTxnX.amount;
        const balanceY = this.getTokenYBalance();
        const balanceX = this.getTokenXBalance();

        assert(balanceX > <uint256>0);
        assert(balanceY > <uint256>0, balanceY > minAmountY);

        const amountOut = this.computeOutTokens(
            amountX,
            balanceX - amountX,
            balanceY,
            this.fee.value.swapFee
        );

        assert(amountOut > <uint256>0, amountOut >= minAmountY, amountOut < balanceY);

        const platformFee = this.computePlatformFee(
            amountX,
            balanceX - amountX,
            balanceY,
        );

        assert(this.transferYTo(this.txn.sender, amountOut));
        assert(this.transferYTo(this.manager.value, platformFee));

        this.Swap.log(
            {
                sender: this.txn.sender,
                amountX: amountX,
                amountY: amountOut,
                directionYtoX: false
            }
        );

        return amountOut;
    }

    swapYtoX(amountY: uint256, minAmountX: uint256): uint256 {
        assert(this.transferYFrom(this.txn.sender, this.app.address, amountY));

        const balanceY = this.getTokenYBalance();
        const balanceX = this.getTokenXBalance();

        assert(balanceX > <uint256>0, balanceX > minAmountX);
        assert(balanceY > <uint256>0);

        const amountOut = this.computeOutTokens(
            amountY,
            balanceY - amountY,
            balanceX,
            this.fee.value.swapFee
        );

        assert(amountOut > <uint256>0, amountOut >= minAmountX, amountOut < balanceX);

        const platformFee = this.computePlatformFee(
            amountY,
            balanceY - amountY,
            balanceX,
        );

        assert(this.transferXTo(this.txn.sender, amountOut));
        assert(this.transferXTo(this.manager.value, platformFee));

        this.Swap.log(
            {
                sender: this.txn.sender,
                amountX: amountOut,
                amountY: amountY,
                directionYtoX: true
            }
        );

        return amountOut;
    }
}
