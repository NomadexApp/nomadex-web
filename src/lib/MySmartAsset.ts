import { makeEmptyTransactionSigner } from "algosdk";
import { SmartAssetClient } from "../contracts/clients/SmartAssetClient";
import { nodeClient } from "./_shared";
import type { TransactionSignerAccount } from "@algorandfoundation/algokit-utils/types/account";

export class MySmartAsset {
    client: SmartAssetClient;

    constructor(id: number, signer?: TransactionSignerAccount) {
        this.client = new SmartAssetClient(
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
    }

    static from(id: number) {
        return new MySmartAsset(id);
    }

    async arc200Symbol(): Promise<string> {
        const composer = this.client.compose();
        const { returns: [symbolBuffer] } = await composer.arc200Symbol({}).simulate({
            allowMoreLogging: true,
            allowEmptySignatures: true,
            allowUnnamedResources: true
        });
        return Buffer.from(symbolBuffer).toString().replace(/\u0000/g, '');
    }


    async arc200Name(): Promise<string> {
        const composer = this.client.compose();
        const { returns: [nameBuffer] } = await composer.arc200Name({}).simulate({
            allowMoreLogging: true,
            allowEmptySignatures: true,
            allowUnnamedResources: true
        });
        return Buffer.from(nameBuffer).toString().replace(/\u0000/g, '');
    }

    async arc200Decimals(): Promise<number> {
        const composer = this.client.compose();
        const { returns: [decimals] } = await composer.arc200Decimals({}).simulate({
            allowMoreLogging: true,
            allowEmptySignatures: true,
            allowUnnamedResources: true
        });
        return decimals;
    }


    async arc200TotalSupply(): Promise<bigint> {
        const composer = this.client.compose();
        const { returns: [supply] } = await composer.arc200TotalSupply({}).simulate({
            allowMoreLogging: true,
            allowEmptySignatures: true,
            allowUnnamedResources: true
        });
        return supply;
    }

    async manager(): Promise<string> {
        const composer = this.client.compose();
        const { returns: [manager] } = await composer.manager({}).simulate({
            allowMoreLogging: true,
            allowEmptySignatures: true,
            allowUnnamedResources: true
        });
        return manager;
    }

    async arc200BalanceOf(address: string): Promise<bigint> {
        const composer = this.client.compose();
        const { returns: [balance] } = await composer.arc200BalanceOf({ owner: address }).simulate({
            allowMoreLogging: true,
            allowEmptySignatures: true,
            allowUnnamedResources: true
        });
        return balance;
    }


    async arc200Allowance(spender: string, owner: string): Promise<bigint> {
        const composer = this.client.compose();
        const { returns: [allowance] } = await composer.arc200Allowance({ spender, owner }).simulate({
            allowMoreLogging: true,
            allowEmptySignatures: true,
            allowUnnamedResources: true
        });
        return allowance;
    }
}