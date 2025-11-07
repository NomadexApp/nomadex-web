import { Store } from '@tanstack/store';
import algosdk from 'algosdk';
import AVMWebProviderSDK from '@agoralabs-sh/avm-web-provider';
import { InstanceWithExtensions, SDKBase } from '@magic-sdk/provider';
import { AlgorandExtension } from '@magic-ext/algorand';
import { MagicUserMetadata } from 'magic-sdk';
import { WalletConnectModalConfig } from '@walletconnect/modal';
import { SignClientTypes } from '@walletconnect/types';

declare enum NetworkId {
    MAINNET = "mainnet",
    TESTNET = "testnet",
    BETANET = "betanet",
    FNET = "fnet",
    LOCALNET = "localnet"
}
interface AlgodConfig {
    token: string | algosdk.AlgodTokenHeader | algosdk.CustomTokenHeader | algosdk.BaseHTTPClient;
    baseServer: string;
    port?: string | number;
    headers?: Record<string, string>;
}
type NetworkConfigMap = Record<NetworkId, AlgodConfig>;
type NetworkConfig = Partial<AlgodConfig> | Partial<Record<NetworkId, Partial<AlgodConfig>>>;

type CustomProvider = {
    connect(args?: Record<string, any>): Promise<WalletAccount[]>;
    disconnect?(): Promise<void>;
    resumeSession?(): Promise<WalletAccount[] | void>;
    signTransactions?<T extends algosdk.Transaction[] | Uint8Array[]>(txnGroup: T | T[], indexesToSign?: number[]): Promise<(Uint8Array | null)[]>;
    transactionSigner?(txnGroup: algosdk.Transaction[], indexesToSign: number[]): Promise<Uint8Array[]>;
};
interface CustomWalletOptions {
    provider: CustomProvider;
}
declare class CustomWallet extends BaseWallet {
    private provider;
    protected store: Store<State>;
    constructor({ id, store, subscribe, getAlgodClient, options, metadata }: WalletConstructor<WalletId.CUSTOM>);
    static defaultMetadata: {
        name: string;
        icon: string;
    };
    connect: (args?: Record<string, any>) => Promise<WalletAccount[]>;
    disconnect: () => Promise<void>;
    resumeSession: () => Promise<void>;
    signTransactions: <T extends algosdk.Transaction[] | Uint8Array[]>(txnGroup: T | T[], indexesToSign?: number[]) => Promise<(Uint8Array | null)[]>;
    transactionSigner: (txnGroup: algosdk.Transaction[], indexesToSign: number[]) => Promise<Uint8Array[]>;
}

interface DeflyWalletConnectOptions {
    bridge?: string;
    shouldShowSignTxnToast?: boolean;
    chainId?: 416001 | 416002 | 416003 | 4160;
}
declare class DeflyWallet extends BaseWallet {
    private client;
    private options;
    protected store: Store<State>;
    constructor({ id, store, subscribe, getAlgodClient, options, metadata }: WalletConstructor<WalletId.DEFLY>);
    static defaultMetadata: {
        name: string;
        icon: string;
    };
    private initializeClient;
    connect: () => Promise<WalletAccount[]>;
    disconnect: () => Promise<void>;
    resumeSession: () => Promise<void>;
    private processTxns;
    private processEncodedTxns;
    signTransactions: <T extends algosdk.Transaction[] | Uint8Array[]>(txnGroup: T | T[], indexesToSign?: number[]) => Promise<(Uint8Array | null)[]>;
}

/** @see https://docs.exodus.com/api-reference/algorand-provider-arc-api/ */
interface EnableNetworkOpts {
    genesisID?: string;
    genesisHash?: string;
}
interface EnableAccountsOpts {
    accounts?: string[];
}
type ExodusOptions = EnableNetworkOpts & EnableAccountsOpts;
interface EnableNetworkResult {
    genesisID: string;
    genesisHash: string;
}
interface EnableAccountsResult {
    accounts: string[];
}
type EnableResult = EnableNetworkResult & EnableAccountsResult;
type SignTxnsResult = (string | null)[];
interface Exodus {
    isConnected: boolean;
    address: string | null;
    enable: (options?: ExodusOptions) => Promise<EnableResult>;
    signTxns: (transactions: WalletTransaction[]) => Promise<SignTxnsResult>;
}
type WindowExtended = {
    algorand: Exodus;
} & Window & typeof globalThis;
declare class ExodusWallet extends BaseWallet {
    private client;
    private options;
    protected store: Store<State>;
    constructor({ id, store, subscribe, getAlgodClient, options, metadata }: WalletConstructor<WalletId.EXODUS>);
    static defaultMetadata: {
        name: string;
        icon: string;
    };
    private initializeClient;
    connect: () => Promise<WalletAccount[]>;
    disconnect: () => Promise<void>;
    resumeSession: () => Promise<void>;
    private processTxns;
    private processEncodedTxns;
    signTransactions: <T extends algosdk.Transaction[] | Uint8Array[]>(txnGroup: T | T[], indexesToSign?: number[]) => Promise<(Uint8Array | null)[]>;
}

declare function isAVMWebProviderSDKError(error: any): error is AVMWebProviderSDK.BaseARC0027Error;
declare const KIBISIS_AVM_WEB_PROVIDER_ID = "f6d1c86b-4493-42fb-b88d-a62407b4cdf6";
declare const ICON: string;
declare class KibisisWallet extends BaseWallet {
    avmWebClient: AVMWebProviderSDK.AVMWebClient | null;
    protected avmWebProviderSDK: typeof AVMWebProviderSDK | null;
    protected store: Store<State>;
    constructor({ id, store, subscribe, getAlgodClient, metadata }: WalletConstructor<WalletId.KIBISIS>);
    static defaultMetadata: {
        name: string;
        icon: string;
    };
    /**
     * private functions
     */
    /**
     * Calls the "disable" method on the provider. This method will timeout after 0.75 seconds.
     * @returns {Promise<AVMWebProviderSDK.IDisableResult>} a promise that resolves to the result.
     * @private
     * @throws {MethodNotSupportedError} if the method is not supported for the configured network.
     * @throws {MethodTimedOutError} if the method timed out by lack of response (>= 3 minutes).
     * @throws {NetworkNotSupportedError} if the network is not supported for the configured network.
     * @throws {UnknownError} if the response result is empty.
     */
    private _disable;
    /**
     * Calls the "enable" method on the provider. This method will timeout after 3 minutes.
     * @returns {Promise<AVMWebProviderSDK.IEnableResult>} a promise that resolves to the result.
     * @private
     * @throws {MethodCanceledError} if the method was cancelled by the user.
     * @throws {MethodNotSupportedError} if the method is not supported for the configured network.
     * @throws {MethodTimedOutError} if the method timed out by lack of response (>= 3 minutes).
     * @throws {NetworkNotSupportedError} if the network is not supported for the configured network.
     * @throws {UnknownError} if the response result is empty.
     */
    private _enable;
    private _getGenesisHash;
    private _initializeAVMWebClient;
    private _initializeAVMWebProviderSDK;
    private _mapAVMWebProviderAccountToWalletAccounts;
    /**
     * Calls the "signTransactions" method to sign the supplied ARC-0001 transactions. This method will timeout after 3
     * minutes.
     * @returns {Promise<AVMWebProviderSDK.ISignTransactionsResult>} a promise that resolves to the result.
     * @private
     * @throws {InvalidInputError} if computed group ID for the txns does not match the assigned group ID.
     * @throws {InvalidGroupIdError} if the unsigned txns is malformed or not conforming to ARC-0001.
     * @throws {MethodCanceledError} if the method was cancelled by the user.
     * @throws {MethodNotSupportedError} if the method is not supported for the configured network.
     * @throws {MethodTimedOutError} if the method timed out by lack of response (>= 3 minutes).
     * @throws {NetworkNotSupportedError} if the network is not supported for the configured network.
     * @throws {UnauthorizedSignerError} if a signer in the request is not authorized by the provider.
     * @throws {UnknownError} if the response result is empty.
     */
    private _signTransactions;
    /**
     * public functions
     */
    connect(): Promise<WalletAccount[]>;
    disconnect(): Promise<void>;
    resumeSession(): Promise<void>;
    private processTxns;
    private processEncodedTxns;
    signTransactions: <T extends algosdk.Transaction[] | Uint8Array[]>(txnGroup: T | T[], indexesToSign?: number[]) => Promise<(Uint8Array | null)[]>;
}

interface KmdConstructor {
    token: string | algosdk.KMDTokenHeader | algosdk.CustomTokenHeader;
    baseServer?: string;
    port?: string | number;
    headers?: Record<string, string>;
}
type KmdOptions = Partial<Pick<KmdConstructor, 'token'>> & Omit<KmdConstructor, 'token'> & {
    wallet?: string;
};
declare class KmdWallet extends BaseWallet {
    private client;
    private options;
    private walletName;
    private walletId;
    private password;
    protected store: Store<State>;
    constructor({ id, store, subscribe, getAlgodClient, options, metadata }: WalletConstructor<WalletId.KMD>);
    static defaultMetadata: {
        name: string;
        icon: string;
    };
    private initializeClient;
    connect: () => Promise<WalletAccount[]>;
    disconnect: () => Promise<void>;
    resumeSession: () => Promise<void>;
    private processTxns;
    private processEncodedTxns;
    signTransactions: <T extends algosdk.Transaction[] | Uint8Array[]>(txnGroup: T | T[], indexesToSign?: number[]) => Promise<(Uint8Array | null)[]>;
    private fetchWalletId;
    private fetchToken;
    private releaseToken;
    private getPassword;
    private fetchAccounts;
}

interface LuteConnectOptions {
    siteName?: string;
}
declare class LuteWallet extends BaseWallet {
    private client;
    private options;
    protected store: Store<State>;
    constructor({ id, store, subscribe, getAlgodClient, options, metadata }: WalletConstructor<WalletId.LUTE>);
    static defaultMetadata: {
        name: string;
        icon: string;
    };
    private initializeClient;
    private getGenesisId;
    connect: () => Promise<WalletAccount[]>;
    disconnect: () => Promise<void>;
    resumeSession: () => Promise<void>;
    private processTxns;
    private processEncodedTxns;
    signTransactions: <T extends algosdk.Transaction[] | Uint8Array[]>(txnGroup: T | T[], indexesToSign?: number[]) => Promise<(Uint8Array | null)[]>;
}

/** @see https://magic.link/docs/blockchains/other-chains/other/algorand */
interface MagicAuthOptions {
    apiKey?: string;
}
type MagicAuthClient = InstanceWithExtensions<SDKBase, {
    algorand: AlgorandExtension;
}>;
declare class MagicAuth extends BaseWallet {
    private client;
    private options;
    protected store: Store<State>;
    userInfo: MagicUserMetadata | null;
    constructor({ id, store, subscribe, getAlgodClient, options, metadata }: WalletConstructor<WalletId.MAGIC>);
    static defaultMetadata: {
        name: string;
        icon: string;
    };
    private initializeClient;
    connect: (args?: Record<string, any>) => Promise<WalletAccount[]>;
    disconnect: () => Promise<void>;
    resumeSession: () => Promise<void>;
    private processTxns;
    private processEncodedTxns;
    signTransactions: <T extends algosdk.Transaction[] | Uint8Array[]>(txnGroup: T | T[], indexesToSign?: number[]) => Promise<(Uint8Array | null)[]>;
}

type MnemonicOptions = {
    persistToStorage?: boolean;
};
declare const LOCAL_STORAGE_MNEMONIC_KEY = "@txnlab/use-wallet:v3_mnemonic";
declare class MnemonicWallet extends BaseWallet {
    private account;
    private options;
    protected store: Store<State>;
    constructor({ id, store, subscribe, getAlgodClient, options, metadata }: WalletConstructor<WalletId.MNEMONIC>);
    static defaultMetadata: {
        name: string;
        icon: string;
    };
    private loadMnemonicFromStorage;
    private saveMnemonicToStorage;
    private checkMainnet;
    private initializeAccount;
    connect: () => Promise<WalletAccount[]>;
    disconnect: () => Promise<void>;
    resumeSession: () => Promise<void>;
    private processTxns;
    private processEncodedTxns;
    signTransactions: <T extends algosdk.Transaction[] | Uint8Array[]>(txnGroup: T | T[], indexesToSign?: number[]) => Promise<(Uint8Array | null)[]>;
}

interface PeraWalletConnectOptions$1 {
    bridge?: string;
    shouldShowSignTxnToast?: boolean;
    chainId?: 416001 | 416002 | 416003 | 4160;
    compactMode?: boolean;
}
declare class PeraWallet$1 extends BaseWallet {
    private client;
    private options;
    protected store: Store<State>;
    constructor({ id, store, subscribe, getAlgodClient, options, metadata }: WalletConstructor<WalletId.PERA>);
    static defaultMetadata: {
        name: string;
        icon: string;
    };
    private initializeClient;
    connect: () => Promise<WalletAccount[]>;
    disconnect: () => Promise<void>;
    resumeSession: () => Promise<void>;
    private processTxns;
    private processEncodedTxns;
    signTransactions: <T extends algosdk.Transaction[] | Uint8Array[]>(txnGroup: T | T[], indexesToSign?: number[]) => Promise<(Uint8Array | null)[]>;
}

interface PeraWalletConnectOptions {
    projectId: string;
    bridge?: string;
    shouldShowSignTxnToast?: boolean;
    chainId?: 416001 | 416002 | 416003 | 4160;
    compactMode?: boolean;
}
declare class PeraWallet extends BaseWallet {
    private client;
    private options;
    protected store: Store<State>;
    constructor({ id, store, subscribe, getAlgodClient, options, metadata }: WalletConstructor<WalletId.PERA2>);
    static defaultMetadata: {
        name: string;
        icon: string;
    };
    private initializeClient;
    connect: () => Promise<WalletAccount[]>;
    disconnect: () => Promise<void>;
    resumeSession: () => Promise<void>;
    private processTxns;
    private processEncodedTxns;
    signTransactions: <T extends algosdk.Transaction[] | Uint8Array[]>(txnGroup: T | T[], indexesToSign?: number[]) => Promise<(Uint8Array | null)[]>;
}

interface SignClientOptions {
    projectId: string;
    relayUrl?: string;
    metadata?: SignClientTypes.Metadata;
}
type WalletConnectModalOptions = Pick<WalletConnectModalConfig, 'enableExplorer' | 'explorerRecommendedWalletIds' | 'privacyPolicyUrl' | 'termsOfServiceUrl' | 'themeMode' | 'themeVariables'>;
type WalletConnectOptions = SignClientOptions & WalletConnectModalOptions;
type SignTxnsResponse = Array<Uint8Array | number[] | string | null | undefined>;
declare class SessionError extends Error {
    constructor(message: string);
}
declare class WalletConnect extends BaseWallet {
    private client;
    private options;
    private modal;
    private modalOptions;
    private session;
    private chains;
    protected store: Store<State>;
    constructor({ id, store, subscribe, getAlgodClient, options, metadata }: WalletConstructor<WalletId.WALLETCONNECT>);
    static defaultMetadata: {
        name: string;
        icon: string;
    };
    /**
     * Get metadata from the current window. This is adapted from the @walletconnect/utils
     * implementation, to avoid requiring the entire package as a dependency.
     * @see https://github.com/WalletConnect/walletconnect-utils/blob/master/browser/window-metadata/src/index.ts
     */
    private getWindowMetadata;
    private initializeClient;
    private initializeModal;
    private onSessionConnected;
    connect: () => Promise<WalletAccount[]>;
    disconnect: () => Promise<void>;
    resumeSession: () => Promise<void>;
    private processTxns;
    private processEncodedTxns;
    signTransactions: <T extends algosdk.Transaction[] | Uint8Array[]>(txnGroup: T | T[], indexesToSign?: number[]) => Promise<(Uint8Array | null)[]>;
}

declare enum WalletId {
    DEFLY = "defly",
    CUSTOM = "custom",
    EXODUS = "exodus",
    KIBISIS = "kibisis",
    KMD = "kmd",
    LUTE = "lute",
    MAGIC = "magic",
    MNEMONIC = "mnemonic",
    PERA = "pera",
    PERA2 = "pera-beta",
    WALLETCONNECT = "walletconnect"
}
type WalletMap = {
    [WalletId.CUSTOM]: typeof CustomWallet;
    [WalletId.DEFLY]: typeof DeflyWallet;
    [WalletId.EXODUS]: typeof ExodusWallet;
    [WalletId.KIBISIS]: typeof KibisisWallet;
    [WalletId.KMD]: typeof KmdWallet;
    [WalletId.LUTE]: typeof LuteWallet;
    [WalletId.MAGIC]: typeof MagicAuth;
    [WalletId.MNEMONIC]: typeof MnemonicWallet;
    [WalletId.PERA]: typeof PeraWallet$1;
    [WalletId.PERA2]: typeof PeraWallet;
    [WalletId.WALLETCONNECT]: typeof WalletConnect;
};
type WalletOptionsMap = {
    [WalletId.CUSTOM]: CustomWalletOptions;
    [WalletId.DEFLY]: DeflyWalletConnectOptions;
    [WalletId.EXODUS]: ExodusOptions;
    [WalletId.KIBISIS]: Record<string, never>;
    [WalletId.KMD]: KmdOptions;
    [WalletId.LUTE]: LuteConnectOptions;
    [WalletId.MAGIC]: MagicAuthOptions;
    [WalletId.MNEMONIC]: MnemonicOptions;
    [WalletId.PERA]: PeraWalletConnectOptions$1;
    [WalletId.PERA2]: PeraWalletConnectOptions;
    [WalletId.WALLETCONNECT]: WalletConnectOptions;
};
type SupportedWallet = WalletIdConfig<WalletId> | WalletId;
type WalletConfigMap = {
    [K in keyof WalletOptionsMap]: {
        options?: WalletOptionsMap[K];
        metadata?: Partial<WalletMetadata>;
    };
};
type WalletOptions<T extends keyof WalletOptionsMap> = WalletOptionsMap[T];
type WalletConfig<T extends keyof WalletConfigMap> = WalletConfigMap[T];
type WalletIdConfig<T extends keyof WalletConfigMap> = {
    [K in T]: {
        id: K;
    } & WalletConfigMap[K];
}[T];
type NonEmptyArray<T> = [T, ...T[]];
type SupportedWallets = NonEmptyArray<SupportedWallet>;
type WalletMetadata = {
    name: string;
    icon: string;
};
interface BaseWalletConstructor {
    id: WalletId;
    metadata: Partial<WalletMetadata> | undefined;
    getAlgodClient: () => algosdk.Algodv2;
    store: Store<State>;
    subscribe: (callback: (state: State) => void) => () => void;
}
type WalletConstructor<T extends keyof WalletOptionsMap> = BaseWalletConstructor & {
    options?: WalletOptions<T>;
    defaultMetadata?: WalletMetadata;
};
type WalletAccount = {
    name: string;
    address: string;
};
/** @see https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0001.md#interface-multisigmetadata */
interface MultisigMetadata {
    /**
     * Multisig version.
     */
    version: number;
    /**
     * Multisig threshold value. Authorization requires a subset of signatures,
     * equal to or greater than the threshold value.
     */
    threshold: number;
    /**
     * List of Algorand addresses of possible signers for this
     * multisig. Order is important.
     */
    addrs: string[];
}
/** @see https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0001.md#interface-wallettransaction */
interface WalletTransaction {
    /**
     * Base64 encoding of the canonical msgpack encoding of a Transaction.
     */
    txn: string;
    /**
     * Optional authorized address used to sign the transaction when the account
     * is rekeyed. Also called the signor/sgnr.
     */
    authAddr?: string;
    /**
     * Multisig metadata used to sign the transaction
     */
    msig?: MultisigMetadata;
    /**
     * Optional list of addresses that must sign the transactions
     */
    signers?: string[];
    /**
     * Optional base64 encoding of the canonical msgpack encoding of a
     * SignedTxn corresponding to txn, when signers=[]
     */
    stxn?: string;
    /**
     * Optional message explaining the reason of the transaction
     */
    message?: string;
    /**
     * Optional message explaining the reason of this group of transaction
     * Field only allowed in the first transaction of a group
     */
    groupMessage?: string;
}
/** @see https://github.com/perawallet/connect/blob/1.3.4/src/util/model/peraWalletModels.ts */
interface SignerTransaction {
    txn: algosdk.Transaction;
    /**
     * Optional authorized address used to sign the transaction when
     * the account is rekeyed. Also called the signor/sgnr.
     */
    authAddr?: string;
    /**
     * Optional list of addresses that must sign the transactions.
     * Wallet skips to sign this txn if signers is empty array.
     * If undefined, wallet tries to sign it.
     */
    signers?: string[];
    /**
     * Optional message explaining the reason of the transaction
     */
    message?: string;
}
interface JsonRpcRequest<T = any> {
    id: number;
    jsonrpc: string;
    method: string;
    params: T;
}
declare class SignTxnsError extends Error {
    code: number;
    data?: any;
    constructor(message: string, code: number, data?: any);
}

declare abstract class BaseWallet {
    readonly id: WalletId;
    readonly metadata: WalletMetadata;
    protected store: Store<State>;
    protected getAlgodClient: () => algosdk.Algodv2;
    subscribe: (callback: (state: State) => void) => () => void;
    protected constructor({ id, metadata, store, subscribe, getAlgodClient }: WalletConstructor<WalletId>);
    static defaultMetadata: WalletMetadata;
    abstract connect(args?: Record<string, any>): Promise<WalletAccount[]>;
    abstract disconnect(): Promise<void>;
    abstract resumeSession(): Promise<void>;
    setActive: () => void;
    setActiveAccount: (account: string) => void;
    abstract signTransactions<T extends algosdk.Transaction[] | Uint8Array[]>(txnGroup: T | T[], indexesToSign?: number[]): Promise<(Uint8Array | null)[]>;
    transactionSigner: (txnGroup: algosdk.Transaction[], indexesToSign: number[]) => Promise<Uint8Array[]>;
    get name(): string;
    get accounts(): WalletAccount[];
    get addresses(): string[];
    get activeAccount(): WalletAccount | null;
    get activeAddress(): string | null;
    get activeNetwork(): NetworkId;
    get isConnected(): boolean;
    get isActive(): boolean;
    protected onDisconnect(): void;
}

type WalletState = {
    accounts: WalletAccount[];
    activeAccount: WalletAccount | null;
};
type WalletStateMap = Partial<Record<WalletId, WalletState>>;
interface State {
    wallets: WalletStateMap;
    activeWallet: WalletId | null;
    activeNetwork: NetworkId;
    algodClient: algosdk.Algodv2;
}
declare const defaultState: State;

interface WalletManagerConfig {
    wallets?: SupportedWallet[];
    network?: NetworkId;
    algod?: NetworkConfig;
    options?: {
        resetNetwork?: boolean;
    };
}
declare class WalletManager {
    _clients: Map<WalletId, BaseWallet>;
    networkConfig: NetworkConfigMap;
    store: Store<State>;
    subscribe: (callback: (state: State) => void) => () => void;
    options: {
        resetNetwork: boolean;
    };
    constructor({ wallets, network, algod, options }?: WalletManagerConfig);
    get algodClient(): algosdk.Algodv2;
    set algodClient(algodClient: algosdk.Algodv2);
    private loadPersistedState;
    private savePersistedState;
    private initializeWallets;
    get wallets(): BaseWallet[];
    getWallet(walletId: WalletId): BaseWallet | undefined;
    resumeSessions(): Promise<void>;
    disconnect(): Promise<void>;
    private initNetworkConfig;
    private createAlgodClient;
    getAlgodClient: () => algosdk.Algodv2;
    setActiveNetwork: (networkId: NetworkId) => Promise<void>;
    get activeNetwork(): NetworkId;
    get activeWallet(): BaseWallet | null;
    get activeWalletAccounts(): WalletAccount[] | null;
    get activeWalletAddresses(): string[] | null;
    get activeAccount(): WalletAccount | null;
    get activeAddress(): string | null;
    get signTransactions(): BaseWallet['signTransactions'];
    get transactionSigner(): algosdk.TransactionSigner;
}

declare class StorageAdapter {
    static getItem(key: string): string | null;
    static setItem(key: string, value: string): void;
}

export { BaseWallet, type BaseWalletConstructor, type CustomProvider, CustomWallet, type CustomWalletOptions, DeflyWallet, type DeflyWalletConnectOptions, type EnableResult, type Exodus, type ExodusOptions, ExodusWallet, ICON, type JsonRpcRequest, KIBISIS_AVM_WEB_PROVIDER_ID, KibisisWallet, type KmdOptions, KmdWallet, LOCAL_STORAGE_MNEMONIC_KEY, MagicAuth, type MagicAuthClient, type MagicAuthOptions, type MnemonicOptions, MnemonicWallet, type MultisigMetadata, NetworkId, PeraWallet$1 as PeraWallet, type PeraWalletConnectOptions$1 as PeraWalletConnectOptions, SessionError, SignTxnsError, type SignTxnsResponse, type SignTxnsResult, type SignerTransaction, type State, StorageAdapter, type SupportedWallet, type SupportedWallets, type WalletAccount, type WalletConfig, type WalletConfigMap, WalletConnect, type WalletConnectOptions, type WalletConstructor, WalletId, type WalletIdConfig, WalletManager, type WalletManagerConfig, type WalletMap, type WalletMetadata, type WalletOptions, type WalletOptionsMap, type WalletState, type WalletTransaction, type WindowExtended, defaultState, isAVMWebProviderSDKError };
