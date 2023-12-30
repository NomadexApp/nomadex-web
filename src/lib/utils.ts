import algosdk from "algosdk";
import Contract from "arc200js";
import { indexerClient, nodeClient } from "./_shared";
import { goto } from "$app/navigation";
import { writable } from "svelte/store";

export class ChainInterface {
    static async arc200_transfer(appId: number, from: string, addrTo: string, amt: bigint) {
        const contract = new Contract(appId, nodeClient, indexerClient, { acc: { addr: from, sk: Uint8Array.from([]) }, simulate: true });
        const res: any = await contract.arc200_transfer(addrTo, amt, true, false);
        return <algosdk.Transaction[]>res.txns.map(txn => algosdk.decodeUnsignedTransaction(Buffer.from(txn, 'base64'))).filter(Boolean);
    }

    static async arc200_transferFrom(appId: number, from: string, addrFrom: string, addrTo: string, amt: bigint) {
        const contract = new Contract(appId, nodeClient, indexerClient, { acc: { addr: from, sk: Uint8Array.from([]) }, simulate: true });
        const res: any = await contract.arc200_transferFrom(addrFrom, addrTo, amt, true, false);
        return <algosdk.Transaction[]>res.txns.map(txn => algosdk.decodeUnsignedTransaction(Buffer.from(txn, 'base64'))).filter(Boolean);
    }

    static async arc200_approve(appId: number, from: string, addrTo: string, amt: bigint) {
        const contract = new Contract(appId, nodeClient, indexerClient, { acc: { addr: from, sk: Uint8Array.from([]) }, simulate: true });
        const res: any = await contract.arc200_approve(addrTo, amt, true, false);
        return <algosdk.Transaction[]>res.txns.map(txn => algosdk.decodeUnsignedTransaction(Buffer.from(txn, 'base64'))).filter(Boolean);
    }
}

export async function hardGoto(target: string) {
    goto(`/loading?from=${location.pathname}&at=${Date.now()}`, { replaceState: true });
    await new Promise(r => setTimeout(r, 5));
    goto(target);
}

export const pageContentRefreshPending = writable(false);
export async function pageContentRefresh(ms = 1000) {
    pageContentRefreshPending.set(true);
    await new Promise(r => setTimeout(r, ms));
    pageContentRefreshPending.set(false);
}