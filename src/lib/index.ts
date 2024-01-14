export enum TokenType {
    Default = '',
    ASA = 'asa',
    ARC200 = 'arc200'
}

export type Token = {
    ticker: string;
    id: number,
    type: TokenType;
    decimals: number;
    unit: number;
};



export const knownPools = [
    // 26179950
    {
        poolId: 26179950,
        lptId: 26179950,
        arc200Asset: {
            assetId: 6779767,
            symbol: 'VIA',
            unit: 1e6
        },
        swapFee: 1_000_000,
    }
    // {
    //     poolId: 24589652,
    //     lptId: 24589656,
    //     arc200Asset: {
    //         assetId: 6779767,
    //         symbol: 'VIA',
    //         unit: 1e6
    //     },
    //     swapFee: 1_000_000,
    // },
    // {
    //     poolId: 25351179,
    //     lptId: 25351184,
    //     arc200Asset: {
    //         assetId: 6778021,
    //         symbol: 'VRC200',
    //         unit: 1e8
    //     },
    //     swapFee: 2_500_000,
    // },
    // {
    //     poolId: 26167314,
    //     lptId: 26167319,
    //     arc200Asset: {
    //         assetId: 6795477,
    //         symbol: 'Tacos',
    //         unit: 1
    //     },
    //     swapFee: 2_500_000
    // }
];

export const knownTokens: Token[] = [
    { ticker: 'VOI', id: 0, type: TokenType.Default, decimals: 6, unit: 1e6 },
    { ticker: 'VIA', id: 6779767, type: TokenType.ARC200, decimals: 6, unit: 1e6 },
    { ticker: 'VRC200', id: 6778021, type: TokenType.ARC200, decimals: 8, unit: 1e8 },
    { ticker: 'Tacos', id: 6795477, type: TokenType.ARC200, decimals: 0, unit: 1 },
    { ticker: 'TEST', id: 26178395, type: TokenType.ARC200, decimals: 6, unit: 1e6 }
];

export const contracts = {
    orderbookLimitOrderApp: 26171479
};


export const contractsConstants = {
    orderbookLimitOrderAppFeePercent: 1
};
