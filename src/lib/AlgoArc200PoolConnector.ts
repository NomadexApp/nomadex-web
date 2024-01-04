import algosdk from "algosdk";
import { AlgoArc200PoolClient } from "../contracts/clients/AlgoArc200PoolClient";
import { getTransactionSignerAccount, signAndSendTransections } from "./UseWallet.svelte";
import { getASABalance, getBoxName, getUnnamedResourcesAccessed, indexerClient, nodeClient } from "./_shared";
import Contract from "arc200js";
import { ChainInterface } from "./utils";
import { addNotification } from "./Notify.svelte";

const ADMIN = 'DYX2V5XF4IKOHE55Z63XAHVBJTMYM723HK5WJZ72BDZ5AFEFKJ5YP4DOQQ';

const SCALE = 100_000_000;
const MIN_BALANCE = 1_000_000;

export class AlgoArc200PoolConnector extends AlgoArc200PoolClient {

    appId = 0;
    lptAssetId = 0;
    arc200AssetId = 0;
    readonly algodClient: algosdk.Algodv2;
    readonly signer: ReturnType<typeof getTransactionSignerAccount>;

    constructor(arc200AssetId: number, appId: number, lptAssetId: number, signer = getTransactionSignerAccount()) {
        super({ id: appId, resolveBy: 'id', sender: signer }, nodeClient);

        this.algodClient = nodeClient;
        this.arc200AssetId = arc200AssetId;
        this.appId = appId;
        this.lptAssetId = lptAssetId;
        this.signer = signer;
    }

    static async createPool(arc200_token: number, governer: string, lpFeePercent: number): Promise<AlgoArc200PoolConnector> {
        const client = new AlgoArc200PoolConnector(0, 0, 0);

        const result = await client.create.createApplication({
            admin: ADMIN,
            arc200_token,
            governer: governer,
            lp_fee: BigInt(lpFeePercent * SCALE) / BigInt(100)
        });

        const appId = result.confirmation?.applicationIndex;

        if (!appId) throw Error('Got invalid app id');

        const connector = new AlgoArc200PoolConnector(arc200_token, Number(appId), 0);

        connector.arc200AssetId = arc200_token;

        return connector;
    }

    async updatePool() {
        await this.update.updateApplication({});
    }

    async initialize() {
        if (!this.signer?.addr) throw Error('Signer address not defined')

        const arc200 = new Contract(
            this.arc200AssetId,
            nodeClient,
            indexerClient,
        );
        const { returnValue: unit } = <{ returnValue: '' }>await arc200.arc200_symbol();

        if (!unit) throw Error('Failed to get unit for the Arc200 token');

        const poolTokenName = `VOI-${unit} LPT`;
        const poolUnitName = `LPT`;
        const poolAppAddress = algosdk.getApplicationAddress(this.appId);

        const arc200TransferTxns = await ChainInterface.arc200_transfer(
            this.arc200AssetId,
            this.signer.addr,
            algosdk.getApplicationAddress(this.appId),
            BigInt(MIN_BALANCE)
        );

        if (!arc200TransferTxns) throw Error('faild to build txns');

        const signedTxns = await this.signer.signer(arc200TransferTxns, arc200TransferTxns.map((_, i) => i));

        const { txId } = await nodeClient.sendRawTransaction(signedTxns).do();

        await algosdk.waitForConfirmation(nodeClient, txId, 3);

        const params = await nodeClient.getTransactionParams().do();

        const txnResponse = await this.createPoolToken({
            algo_seed_txn: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                from: this.signer?.addr,
                to: poolAppAddress,
                amount: MIN_BALANCE + 1000,
                suggestedParams: params
            }),
            lpt_name: poolTokenName,
            lpt_unit: poolUnitName
        });

        this.lptAssetId = Number(txnResponse.return);

        return txnResponse.return;
    }

    async addLiquidity(algoAmount: number, arc200Amount: number) {
        if (!this.signer?.addr) throw Error('signer undefined');

        const params = await nodeClient.getTransactionParams().do();

        const lptBalance = await getASABalance(this.lptAssetId, this.signer.addr);

        console.log({
            from: this.signer.addr,
            to: this.signer.addr,
            amount: 0,
            assetIndex: this.lptAssetId,
            suggestedParams: params,
        })
        const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: this.signer.addr,
            to: this.signer.addr,
            amount: 0,
            assetIndex: this.lptAssetId,
            suggestedParams: params,
        });

        const approveTxns = await ChainInterface.arc200_approve(
            this.arc200AssetId,
            this.signer.addr,
            algosdk.getApplicationAddress(this.appId),
            BigInt(arc200Amount)
        );
        console.log('__approved', approveTxns);

        const mintArgs = () => ({
            pay_txn: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                amount: algoAmount,
                from: this.signer.addr,
                to: algosdk.getApplicationAddress(this.appId),
                suggestedParams: params,
            }),
            arc200_amount: arc200Amount,
            lpt_asset: this.lptAssetId,
        });
        const composer = this.compose();
        console.log('___approved');

        const opts = await this.getUnnamedResourcesAccessedFromMethod('mint', mintArgs());
        console.log('____approved');

        const mintTxns = (
            await composer
                .mint(mintArgs(), {
                    ...opts,
                    boxes: [
                        ...opts.boxes,
                        {
                            appId: this.arc200AssetId,
                            name: getBoxName(algosdk.getApplicationAddress(this.appId)),
                        },
                    ],
                })
                .atc()
        ).buildGroup().map(({ txn }) => txn);

        await signAndSendTransections(nodeClient, [...(lptBalance === -1 ? [[optInTxn]] : []), approveTxns, mintTxns]);
    }

    async getUnnamedResourcesAccessedFromMethod<C extends AlgoArc200PoolConnector>(methodName: keyof ReturnType<C['compose']>, args: any = {}) {
        const cl: any = new AlgoArc200PoolClient({
            id: this.appId,
            resolveBy: 'id',
            sender: this.signer
        }, nodeClient);

        const composer = await cl.compose()[methodName](args, {}).atc();
        const txns = composer.buildGroup().map(({ txn }) => txn)

        return getUnnamedResourcesAccessed(txns);
    }


    /****************/


    async swapVoiToArc200(voiAmount: number, minViaAmount: number) {
        const suggestedParams = await nodeClient.getTransactionParams().do();

        const admin = (await nodeClient.getApplicationByID(this.appId).do())
            ?.params?.['global-state']
            ?.find(state => Buffer.from(state.key, 'base64').toString() === 'admin')

        const adminAddressBase64 = admin?.value?.bytes;

        let adminAddress = '';
        if (adminAddressBase64) {
            adminAddress = algosdk.encodeAddress(new Uint8Array(Buffer.from(adminAddressBase64, 'base64')))
        }

        const swapArgs = () => ({
            pay_txn: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                amount: voiAmount,
                from: this.signer.addr,
                to: algosdk.getApplicationAddress(this.appId),
                suggestedParams: suggestedParams,
            }),
            min_amount: minViaAmount
        });

        const composer = this.compose();
        const opts = await this.getUnnamedResourcesAccessedFromMethod('swapToArc200', swapArgs());
        const atc = await composer
            .swapToArc200(swapArgs(), {
                ...opts,
                boxes: [
                    ...opts.boxes,
                    {
                        appId: this.arc200AssetId,
                        name: getBoxName(algosdk.getApplicationAddress(this.appId)),
                    },
                ],
                accounts: [...opts.accounts, adminAddress]
            })
            .atc();

        const swapTxns = atc.buildGroup().map(({ txn }) => txn);

        await signAndSendTransections(nodeClient, [swapTxns]);
        console.log({ success: true });
    }

    async swapArc200ToVoi(arc200Amount: number, minVoiAmount: number) {

        const admin = (await nodeClient.getApplicationByID(this.appId).do())
            ?.params?.['global-state']
            ?.find(state => Buffer.from(state.key, 'base64').toString() === 'admin')

        const adminAddressBase64 = admin?.value?.bytes;

        let adminAddress = '';
        if (adminAddressBase64) {
            adminAddress = algosdk.encodeAddress(new Uint8Array(Buffer.from(adminAddressBase64, 'base64')))
        }


        const approveTxns = await ChainInterface.arc200_approve(
            this.arc200AssetId,
            this.signer.addr,
            algosdk.getApplicationAddress(this.appId),
            BigInt(arc200Amount)
        );

        const swapArgs = () => ({
            arc200_amount: arc200Amount,
            min_amount: minVoiAmount,
        });
        const composer = this.compose();

        const opts = await this.getUnnamedResourcesAccessedFromMethod('swapFromArc200', swapArgs());

        const atc = await composer
            .swapFromArc200(swapArgs(), {
                ...opts,
                boxes: [
                    ...opts.boxes,
                    {
                        appId: this.arc200AssetId,
                        name: getBoxName(algosdk.getApplicationAddress(this.appId)),
                    },
                ],
                accounts: [...opts.accounts, adminAddress]
            })
            .atc();

        const swapTxns = atc.buildGroup().map(({ txn }) => txn);

        await signAndSendTransections(nodeClient, [approveTxns, swapTxns]);
        console.log({ success: true });
    }


    // async mint(amountA: number, amountB: number) {
    //     const suggestedParams = await nodeClient.getTransactionParams().do();
    //     const client = getClient(currentAppId);
    //     const voiAmount = Math.floor(amountA * 1e6);
    //     const viaAmount = Math.floor(amountB * 1e6);

    //     const lptBalance = await getASABalance(currentLptAssetId, get(connectedAccount));
    //     console.log({ lptBalance });

    //     const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    //         from: get(connectedAccount),
    //         to: get(connectedAccount),
    //         amount: 0,
    //         assetIndex: currentLptAssetId,
    //         suggestedParams,
    //     });

    //     const approveTxns = await ChainInterface.arc200_approve(
    //         viaAppId,
    //         get(connectedAccount),
    //         algosdk.getApplicationAddress(currentAppId),
    //         BigInt(viaAmount)
    //     );

    //     const mintArgs = () => ({
    //         pay_txn: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    //             amount: voiAmount,
    //             from: get(connectedAccount),
    //             to: algosdk.getApplicationAddress(currentAppId),
    //             suggestedParams: suggestedParams,
    //         }),
    //         arc200_amount: viaAmount,
    //         pool_token: currentLptAssetId,
    //     });
    //     const composer = client.compose();

    //     const opts = await getUnnamedResourcesAccessedFromMethod(client, 'mint', mintArgs());

    //     const atc = await composer
    //         .mint(mintArgs(), {
    //             ...opts,
    //             boxes: [
    //                 ...opts.boxes,
    //                 {
    //                     appId: viaAppId,
    //                     name: getBoxName(algosdk.getApplicationAddress(currentAppId)),
    //                 },
    //             ],
    //         })
    //         .atc();

    //     const mintTxns = atc.buildGroup().map(({ txn }) => txn);

    //     await signAndSendTransections(nodeClient, [...(lptBalance === -1 ? [[optInTxn]] : []), approveTxns, mintTxns]);

    //     console.log({ success: true });
    // }

    async removeLiquidity(amount: number) {
        const suggestedParams = await nodeClient.getTransactionParams().do();

        const lptAmount = Math.floor(amount * 1e6);

        const removeLiqArgs = () => ({
            lpt_xfer_txn: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                assetIndex: this.lptAssetId,
                amount: lptAmount,
                from: this.signer.addr,
                to: algosdk.getApplicationAddress(this.appId),
                suggestedParams: suggestedParams,
            }),
        });

        const composer = this.compose();

        const atc = await composer
            .burn(removeLiqArgs(), await this.getUnnamedResourcesAccessedFromMethod('burn', removeLiqArgs()))
            .atc();

        const burnTxns = atc.buildGroup().map(({ txn }) => txn);

        await signAndSendTransections(nodeClient, [burnTxns]);
        console.log({ success: true });
    }

    async invoke(functionName: string, ...args: any[]) {
        const removeNot = addNotification('pending', `Txn in progress`)
        try {
            const resp = await this[<string>functionName](...args);
            addNotification('success', `Success`, 5000);
            removeNot();
            return resp;
        } catch (error) {
            console.error((<Error>error).message);
            addNotification('error', (<Error>error).message, 15000);
        }
        removeNot();
    }
}