import { ABIType, AtomicTransactionComposer, getApplicationAddress, makeAssetTransferTxnWithSuggestedParamsFromObject, makeEmptyTransactionSigner, makePaymentTxnWithSuggestedParamsFromObject, Transaction, waitForConfirmation, type Algodv2, type TransactionSigner } from "algosdk";
import { PoolClient } from './PoolClient'
import type { TransactionSignerAccount } from "@algorandfoundation/algokit-utils/types/account";
import { MySmartAsset } from "./MySmartAsset";
import { SmartAssetClient } from "./SmartAssetClient";
import { contracts } from "../constants";
import { populateAppCallResources } from "@algorandfoundation/algokit-utils";

export enum TokenType { ALGO = 0, ASA = 1, SMART = 2 };
type Token = { id: number, type: TokenType };

export class MyPool extends MySmartAsset {
    id: number;
    network: keyof typeof contracts;
    poolClient: PoolClient;
    signer: {
        addr: string;
        signer: TransactionSigner;
    };
    algod: Algodv2;

    constructor(id: number, network: keyof typeof contracts, nodeClient: Algodv2, signer?: TransactionSignerAccount) {
        super(id, nodeClient, signer);
        this.id = id;
        this.poolClient = new PoolClient(
            {
                id: id,
                resolveBy: 'id',
                sender: signer ?? {
                    addr: 'DYX2V5XF4IKOHE55Z63XAHVBJTMYM723HK5WJZ72BDZ5AFEFKJ5YP4DOQQ',
                    signer: makeEmptyTransactionSigner()
                },
            },
            nodeClient
        );
        this.network = network;
        this.algod = nodeClient;
        this.signer = signer;
    }

    async buildDepositTxn(token: { id: number; type: number }, amount: bigint) {
        if (token.type === 0) {
            return makePaymentTxnWithSuggestedParamsFromObject({
                from: this.signer.addr,
                to: getApplicationAddress(this.id),
                amount: amount,
                suggestedParams: await this.algod.getTransactionParams().do(),
            });
        } else if (token.type === 1) {
            return makeAssetTransferTxnWithSuggestedParamsFromObject({
                assetIndex: token.id,
                from: this.signer.addr,
                to: getApplicationAddress(this.id),
                amount: amount,
                suggestedParams: await this.algod.getTransactionParams().do(),
            });
        } else if (token.type === 2) {
            const smartAssetClient = new SmartAssetClient(
                {
                    id: token.id,
                    resolveBy: 'id',
                    sender: this.signer,
                },
                this.algod
            );
            const { transaction } = await smartAssetClient.arc200Transfer(
                {
                    to: getApplicationAddress(this.id),
                    value: amount,
                },
                { sendParams: { populateAppCallResources: true, skipSending: true } }
            );
            return transaction;
        }
        throw Error('');
    }

    async makeOptinTxns(token: Token): Promise<Transaction[]> {
        const params = await this.algod.getTransactionParams().do();
        const txns: Transaction[] = [];
        if (token.type === TokenType.ASA) {
            let isOptedIn = false;

            try {
                const info = await this.algod.accountAssetInformation(this.signer.addr, token.id).do();
                if (typeof info?.['asset-holding']?.amount !== 'undefined') isOptedIn = true;
            } catch (e: unknown) {
                if (e) {
                    // 
                };
            }

            if (!isOptedIn) {
                txns.push(
                    makeAssetTransferTxnWithSuggestedParamsFromObject({
                        assetIndex: token.id,
                        from: this.signer.addr,
                        to: this.signer.addr,
                        amount: 0,
                        suggestedParams: params,
                    })
                );
            }
        } else if (token.type === TokenType.SMART) {
            const factoryAddress = getApplicationAddress(contracts[this.network].poolFcatory);
            const factoryBalance = await MySmartAsset.from(token.id, this.algod).arc200BalanceOf(factoryAddress);
            const userBalance = await MySmartAsset.from(token.id, this.algod).arc200BalanceOf(this.signer.addr);
            const getTxns = async (address: string) => {
                const client = new SmartAssetClient(
                    {
                        id: token.id,
                        resolveBy: 'id',
                        sender: {
                            addr: this.signer.addr,
                            signer: makeEmptyTransactionSigner(),
                        },
                    },
                    this.algod
                );
                return [
                    makePaymentTxnWithSuggestedParamsFromObject({
                        from: this.signer.addr,
                        to: getApplicationAddress(token.id),
                        amount: 28500,
                        suggestedParams: params,
                    }),
                    (await client.arc200Transfer({ to: address, value: 0 }, { sendParams: { skipSending: true } })).transaction,
                ];
            };
            if (factoryBalance < 1n) {
                txns.push(...(await getTxns(factoryAddress)));
            }
            if (userBalance < 1n) {
                txns.push(...(await getTxns(this.signer.addr)));
            }
        }
        return txns;
    }

    async addLiquidity(tokenA: Token, tokenB: Token, assetAAmount: bigint, assetBAmount: bigint) {
        try {
            const alphaTxn = await this.buildDepositTxn(tokenA, assetAAmount);
            const betaTxn = await this.buildDepositTxn(tokenB, assetBAmount);

            const resp = await this.poolClient.addLiquidity(
                {
                    alphaTxn: alphaTxn,
                    betaTxn: betaTxn,
                },
                {
                    sendParams: { populateAppCallResources: true },
                }
            );

            return resp.return;
        } catch (e) {
            console.error(e);
        }
    }

    async removeLiquidity(lptAmount: bigint) {
        const poolClient = new PoolClient(
            {
                id: this.id,
                resolveBy: 'id',
                sender: this.signer,
            },
            this.algod
        );

        const resp = await poolClient.removeLiquidity(
            {
                lptAmount: lptAmount,
            },
            {
                sendParams: { populateAppCallResources: true },
            }
        );

        return resp.return;
    }

    async swap(tokenA: Token, tokenB: Token, assetAAmount: bigint, assetBAmount: bigint, isDirectionAlphaToBeta: boolean) {
        const poolClient = new PoolClient(
            {
                id: this.id,
                resolveBy: 'id',
                sender: this.signer,
            },
            this.algod
        );

        const args = {
            txn: await this.buildDepositTxn(tokenA, assetAAmount),
            minAmount: 0n,
        };
        const txns: Transaction[] = [];
        const optinTxns = await this.makeOptinTxns(isDirectionAlphaToBeta ? tokenB : tokenA);
        txns.push(...optinTxns);

        if (isDirectionAlphaToBeta) {
            const { transactions } = await poolClient.swapAlphaToBeta(
                {
                    alphaTxn: args.txn,
                    minBetaAmount: args.minAmount,
                },
                {
                    sendParams: { skipSending: true },
                }
            );
            txns.push(...transactions);
        } else {
            const { transactions } = await poolClient.swapBetaToAlpha(
                {
                    betaTxn: args.txn,
                    minAlphaAmount: args.minAmount,
                },
                {
                    sendParams: { skipSending: true },
                }
            );
            txns.push(...transactions);
        }

        let atc = new AtomicTransactionComposer();
        const mpt = makeEmptyTransactionSigner();
        for (const txn of txns) {
            txn.group = undefined;
            atc.addTransaction({ txn: txn, signer: mpt });
        }
        atc.buildGroup();
        atc = await populateAppCallResources(atc, this.algod);
        const finalTxns = atc.buildGroup().map(({ txn }) => txn);
        const signed = await this.signer.signer(finalTxns, []);

        await this.algod.sendRawTransaction(signed).do();
        const result = await waitForConfirmation(this.algod, finalTxns.at(-1)?.txID() ?? '', 3);

        const log: Uint8Array = result.logs.find((log: Uint8Array) => log.length === 36);
        if (log) {
            return ABIType.from('uint256').decode(log.slice(4)) as bigint;
        }
    }
}