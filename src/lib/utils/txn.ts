import { nodeClient } from "$lib/_shared";
import algosdk, { type AtomicTransactionComposer, type EncodedSignedTransaction } from "algosdk";

export async function getUnnamedResourcesAccessed(txns: algosdk.Transaction[]) {
    const signer = algosdk.makeEmptyTransactionSigner();
    txns = txns.map((txn) => algosdk.decodeUnsignedTransaction(algosdk.encodeUnsignedTransaction(txn)));

    for (const txn of txns) {
        txn.group = undefined;
    }

    algosdk.assignGroupID(txns);

    const signed = await signer(
        txns,
        txns.map((_, i) => i)
    );

    const request = new algosdk.modelsv2.SimulateRequest({
        txnGroups: [
            new algosdk.modelsv2.SimulateRequestTransactionGroup({
                txns: <EncodedSignedTransaction[]>signed.map(algosdk.decodeObj),
            }),
        ],
        allowUnnamedResources: true,
        allowEmptySignatures: true,
    });

    const simulated = await nodeClient.simulateTransactions(request).do();

    return {
        apps: (simulated.txnGroups[0].unnamedResourcesAccessed?.apps ?? []).map((n) => Number(n)),
        assets: (simulated.txnGroups[0].unnamedResourcesAccessed?.assets ?? []).map((n) => Number(n)),
        boxes: (simulated.txnGroups[0].unnamedResourcesAccessed?.boxes ?? []).map((box) => ({
            appIndex: Number(box.app),
            name: box.name,
        })),
        accounts: simulated.txnGroups[0].unnamedResourcesAccessed?.accounts ?? [],
        simulated,
    };
}

export async function getUnnamedResourcesAccessedFromComposer(composer: AtomicTransactionComposer) {
    const txns = composer.buildGroup().map(({ txn }) => txn);
    return getUnnamedResourcesAccessed(txns);
}

export async function getUnnamedResourcesAccessedFromMethod<C extends { 'compose' }>(
    client: C,
    methodName: keyof ReturnType<C['compose']>,
    args: any = {}
) {
    const cl: any = client;
    const composer: AtomicTransactionComposer = await cl.compose()[methodName](args, {}).atc();
    return getUnnamedResourcesAccessedFromComposer(composer);
}
