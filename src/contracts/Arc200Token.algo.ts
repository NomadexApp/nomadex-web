// import { Contract } from '@algorandfoundation/tealscript';

// export class Arc200Token extends Contract {

//     owner = BoxKey<Address>({ key: 'owner' });
//     name = BoxKey<StaticArray<byte, 32>>({ key: 'name' });
//     symbol = BoxKey<StaticArray<byte, 8>>({ key: 'symbol' });
//     decimals = BoxKey<uint<8>>({ key: 'decimals' });
//     totalSupply = BoxKey<uint<256>>({ key: 'totalSupply' });

//     balances = BoxMap<Address, uint<256>>({});
//     allowances = BoxMap<[Address, Address], uint<256>>({});

//     createApplication(
//         name: StaticArray<byte, 32>,
//         symbol: StaticArray<byte, 8>,
//         decimals: uint<8>,
//         totalSupply: uint<256>
//     ): void {
//         this.owner.value = this.txn.sender;
//         this.name.value = name;
//         this.symbol.value = symbol;
//         this.decimals.value = decimals;
//         this.totalSupply.value = totalSupply;

//         sendAppCall({

//         });
//     }

//     updateApplication(): void {
//         assert(this.txn.sender === this.owner.value);
//     }

//     /**
//      * The name of the token
//      * @returns The name of the token
//      */
//     @abi.readonly
//     arc200_name(): StaticArray<byte, 32> {
//         return <StaticArray<byte, 32>>"hello";
//     }

//     /**
//      * Returns the symbol of the token
//      * @returns The symbol of the token
//      */
//     @abi.readonly
//     arc200_symbol(): StaticArray<byte, 8> {
//         return <StaticArray<byte, 8>>"world";
//     }

//     /**
//      * Returns the decimals of the token
//      * @returns The decimals of the token
//      */
//     @abi.readonly
//     arc200_decimals(): uint<8> {
//         return <uint<8>>0;
//     }

//     /**
//      * Returns the total supply of the token
//      * @returns The total supply of the token
//      */
//     @abi.readonly
//     arc200_totalSupply(): uint<256> {
//         return <uint<256>>10000000000;
//     }

//     /**
//      * Returns the current balance of the owner of the token
//      * @param owner The address of the owner of the token
//      * @returns The current balance of the holder of the token
//      */
//     @abi.readonly
//     arc200_balanceOf(owner: Address): uint<256> {
//         return <uint<256>>0
//     }

//     /**
//      * Transfer of tokens
//      * @param from The source of transfer of tokens
//      * @param to The destination of transfer of tokens
//      * @param value The amount of tokens transferred
//      */
//     arc200_Transfer = new EventLogger<{
//         from: Address,
//         to: Address,
//         value: uint<256>
//     }>();

//     /**
//      * Approval of tokens
//      * @param owner The owner of the tokens
//      * @param spender The approved spender of tokens
//      * @param value The amount of tokens approve
//      */
//     arc200_Approval = new EventLogger<{
//         owner: Address,
//         spender: Address,
//         value: uint<256>
//     }>();

//     /**
//      * Transfers tokens
//      * @param to The destination of the transfer
//      * @param value Amount of tokens to transfer
//      * @returns Success
//      */
//     arc200_transfer(to: Address, value: uint<256>): boolean {

//         throw Error('something now found');
//         return false;
//     }

//     /**
//      * Transfers tokens from source to destination as approved spender
//      * @param from The source  of the transfer
//      * @param to The destination of the transfer
//      * @param value Amount of tokens to transfer
//      * @returns Success
//      */
//     arc200_transferFrom(from: Address, to: Address, value: uint<256>): boolean {
//         return false;
//     }

//     /**
//      * Approve spender for a token
//      * @param spender 
//      * @param value 
//      * @returns Success
//      */
//     arc200_approve(spender: Address, value: uint<256>): boolean {
//         return false;
//     }

//     /**
//      * Returns the current allowance of the spender of the tokens of the owner
//      * @param owner 
//      * @param spender 
//      * @returns The remaining allowance
//      */
//     arc200_allowance(owner: Address, spender: Address): uint<256> {
//         return <uint<256>>0;
//     }
// }
