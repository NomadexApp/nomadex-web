import type { Token } from "$lib";
import algosdk from "algosdk";
import { currentAppId } from "./_deployed";
import { getClient, getUnnamedResourcesAccessed, getUnnamedResourcesAccessedFromMethod } from "./_shared";
import { getTransactionSignerAccount } from "./UseWallet.svelte";

export async function simulateHowMuch(tokenA: Token, tokenB: Token, amount: bigint, simulateByOutAmount = false) {
    const client = getClient(currentAppId, getTransactionSignerAccount());

    let atc: algosdk.AtomicTransactionComposer | undefined = undefined;
    const compose = client.compose();

    if (tokenA.ticker === 'VOI' && tokenB.ticker === 'VIA') {
        if (simulateByOutAmount) {
            atc = await compose.simulateSwapVoiForXVia(
                { viaAmount: amount },
                await getUnnamedResourcesAccessedFromMethod(client, 'simulateSwapVoiForXVia', { viaAmount: amount })
            ).atc();
        } else {
            atc = await compose.simulateSwapVoiForVia(
                { voiAmount: amount },
                await getUnnamedResourcesAccessedFromMethod(client, 'simulateSwapVoiForVia', { voiAmount: amount })
            ).atc();
        }
    } else if (tokenA.ticker === 'VIA' && tokenB.ticker === 'VOI') {
        if (simulateByOutAmount) {
            atc = await compose.simulateSwapViaForXVoi(
                { voiAmount: amount },
                await getUnnamedResourcesAccessedFromMethod(client, 'simulateSwapViaForXVoi', { voiAmount: amount })
            ).atc();
        } else {
            atc = await compose.simulateSwapViaForVoi(
                { viaAmount: amount },
                await getUnnamedResourcesAccessedFromMethod(client, 'simulateSwapViaForVoi', { viaAmount: amount })
            ).atc();
        }
    }

    if (atc) {
        const txns = atc.buildGroup().map(({ txn }) => txn);

        const logs: any = (await getUnnamedResourcesAccessed(txns))
            .simulated
            .txnGroups
            .map(group => group.txnResults.map(txn => txn.txnResult.logs))
            ?.[0]
            ?.[0]
            ?.[0];

        if (logs) {
            return algosdk.ABIUintType.from('uint64').decode(logs.slice(-8));
        }
    }
    return 0
}