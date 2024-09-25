/* eslint-disable prefer-const */
import { nodeClientAllowsCompile } from "$lib/_shared";
import algosdk from "algosdk";
import { PoolFactoryClient } from "../contracts/clients/PoolFactoryClient";
import { SCALE } from "../contracts/pool/constants";
import { PoolClient } from "../contracts/clients/PoolClient";


const mn = 'cage napkin merry neglect canyon various flight lunar resemble swift quarter again budget much wild ready blast goose hover clarify jar balcony echo absorb scale';
const account = algosdk.mnemonicToSecretKey(mn);
console.log('Using Account:', account.addr);

function strToFixedBytes(str: string, length: number) {
    str = str.slice(0, length);
    const uint8Array = new TextEncoder().encode(str);
    const restArray = new Uint8Array(length - uint8Array.length);

    return Uint8Array.from([...uint8Array, ...restArray]);
}

async function deployFactory() {
    let factory = new PoolFactoryClient({
        id: 0,
        resolveBy: 'id',
        sender: account
    }, nodeClientAllowsCompile);

    console.log('deploying factory...');
    const appCreateResponse = await factory.create.createApplication({
        owner: account.addr,
        fee: SCALE * 0.01,
    });
    const factoryId = Number(appCreateResponse.confirmation?.applicationIndex);
    console.log('Created Factory:', { appId: factoryId });
    return factoryId;
}

async function createAsa(symbol: string) {
    console.log('Create ASA');

    let txn: algosdk.Transaction;
    txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: account.addr,
        assetName: 'Asset Name',
        unitName: symbol,
        decimals: 6,
        total: 10_000_000_000_000,
        manager: account.addr,
        reserve: account.addr,
        clawback: account.addr,
        freeze: account.addr,
        assetURL: 'http://localhost',
        defaultFrozen: false,
        suggestedParams: await nodeClientAllowsCompile.getTransactionParams().do(),
    });

    await nodeClientAllowsCompile.sendRawTransaction([txn.signTxn(account.sk)]).do();
    console.log('Txn:', txn.txID());
    let resp = await algosdk.waitForConfirmation(nodeClientAllowsCompile, txn.txID(), 3);
    const asaId = resp['asset-index'];

    console.log('Craeted ASA:', asaId);

    return Number(asaId);
}

async function createPool(factoryId: number, factory: PoolFactoryClient, alphaId: number, alphaType: number, betaId: number, betaType: number) {
    console.log('Creating pool:', alphaType === 0 ? 'ALGO' : 'ASA', '-', betaType === 0 ? 'ALGO' : 'ASA');

    const { return: poolId } = await factory.createPool(
        {
            alphaId: alphaId,
            alphaType: alphaType,
            betaId: betaId,
            betaType: betaType,
            name: strToFixedBytes(`LP`, 32),
            symbol: strToFixedBytes(`LPT`, 8),
            swapFee: SCALE * 0.01,
            payTxn: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                from: account.addr,
                to: algosdk.getApplicationAddress(factoryId),
                amount: 2_000_000,
                suggestedParams: await nodeClientAllowsCompile.getTransactionParams().do(),
            }),
        },
        {
            sendParams: { populateAppCallResources: true },
        }
    );

    console.log('Created Pool:', poolId);

    console.log('Pool bootstraping...');
    await factory.poolBootstrap({
        poolId: Number(poolId),
    }, { sendParams: { populateAppCallResources: true } });

    console.log('Done bootstraping.');

    return Number(poolId);
}

async function testAlgoAsaLiquidity(poolId: number, pool: PoolClient, asaId: number) {
    console.log('Adding liquidity');

    const resp = await pool.addLiquidity({
        alphaTxn: algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: account.addr,
            to: algosdk.getApplicationAddress(Number(poolId)),
            amount: 1_000_000,
            suggestedParams: await nodeClientAllowsCompile.getTransactionParams().do(),
        }),
        betaTxn: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            assetIndex: asaId,
            from: account.addr,
            to: algosdk.getApplicationAddress(Number(poolId)),
            amount: 1_000_000,
            suggestedParams: await nodeClientAllowsCompile.getTransactionParams().do(),
        })
    }, { sendParams: { populateAppCallResources: true } });

    console.log('Added Liquidity:', resp.return);

    console.log('Removing Liquidity...');

    const removeResp = await pool.removeLiquidity({
        lptAmount: 1_000_000
    }, { sendParams: { populateAppCallResources: true } });

    console.log('Removed Liquidity:', removeResp.return);
}

async function testAsaAsaLiquidity(poolId: number, pool: PoolClient, asaId: number, asaId2: number) {
    console.log('Adding liquidity');

    const resp = await pool.addLiquidity({
        alphaTxn: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            assetIndex: asaId,
            from: account.addr,
            to: algosdk.getApplicationAddress(Number(poolId)),
            amount: 1_000_000,
            suggestedParams: await nodeClientAllowsCompile.getTransactionParams().do(),
        }),
        betaTxn: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            assetIndex: asaId2,
            from: account.addr,
            to: algosdk.getApplicationAddress(Number(poolId)),
            amount: 1_000_000,
            suggestedParams: await nodeClientAllowsCompile.getTransactionParams().do(),
        })
    }, { sendParams: { populateAppCallResources: true } });

    console.log('Added Liquidity:', resp.return);

    console.log('Removing Liquidity...');

    const removeResp = await pool.removeLiquidity({
        lptAmount: 10
    }, { sendParams: { populateAppCallResources: true } });

    console.log('Removed Liquidity:', removeResp.return);
}

async function main() {
    console.log('Balance:', (await nodeClientAllowsCompile.accountInformation(account.addr).do()).amount / 1e6);

    const factoryId = await deployFactory();

    const factory = new PoolFactoryClient({
        id: factoryId,
        resolveBy: 'id',
        sender: account
    }, nodeClientAllowsCompile);

    const asa1Id = await createAsa('ASA1');
    const asa2Id = await createAsa('ASA2');

    const pool1Id = await createPool(factoryId, factory, 0, 0, asa1Id, 1);

    const pool1 = new PoolClient({
        id: Number(pool1Id),
        resolveBy: 'id',
        sender: account
    }, nodeClientAllowsCompile);

    await testAlgoAsaLiquidity(pool1Id, pool1, asa1Id);

    const pool2Id = await createPool(factoryId, factory, asa1Id, 1, asa2Id, 1);

    const pool2 = new PoolClient({
        id: Number(pool2Id),
        resolveBy: 'id',
        sender: account
    }, nodeClientAllowsCompile);

    await testAsaAsaLiquidity(pool2Id, pool2, asa1Id, asa2Id);

    console.log('Swapping...');

    const swapResp1 = await pool2.swapAlphaToBeta({
        alphaTxn: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            assetIndex: asa1Id,
            from: account.addr,
            to: algosdk.getApplicationAddress(Number(pool2Id)),
            amount: 1_000_000,
            suggestedParams: await nodeClientAllowsCompile.getTransactionParams().do(),
        }),
        minBetaAmount: 100_000
    }, { sendParams: { populateAppCallResources: true } });

    console.log('Swap1:', swapResp1.return);

    console.log('Swapping (Reverese)...');

    const swapResp2 = await pool2.swapBetaToAlpha({
        betaTxn: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            assetIndex: asa2Id,
            from: account.addr,
            to: algosdk.getApplicationAddress(Number(pool2Id)),
            amount: Number(swapResp1.return),
            suggestedParams: await nodeClientAllowsCompile.getTransactionParams().do(),
        }),
        minAlphaAmount: 100_000
    }, { sendParams: { populateAppCallResources: true } });

    console.log('Swap2:', swapResp2.return);
}

main();