import type {AbiParameterToPrimitiveType} from '@nomicfoundation/hardhat-viem/types.js';
import type {AbiParametersToPrimitiveTypes, ExtractAbiFunction} from 'abitype';
import hre from 'hardhat';
import type {Address} from 'viem';
import {baseSepolia, bob} from 'viem/chains';
import {RMRKRegistry} from '../../abis/RMRKRegistry.js';
import {DEFAULT_REGISTRY_CONFIG, RMRK_REGISTRY} from '../consts/rmrk-contracts.js';
import {sleep} from '../utils/utils.js';
import {KUSAMA_KINGDOM_METADATA_IPFS_BASE} from './consts.js';
import {KUSAMA_KINGDOM_KUSAMA_DETAILS} from './kusama-details.js';
import {mint} from './mint.js';

const Erc721Lego = 5;

export const ROYALTY_BPS = 500;
export const ROYALTY_RECEPIENT: Address = '0xCEb8651B49DF24CB46DfeeE86E75492D8e4ba651'; // Multisig

type DeployArgs = [
    initialOwner: AbiParameterToPrimitiveType<{ name: 'initialOwner'; type: 'address' }>,
    name: AbiParameterToPrimitiveType<{ name: 'name'; type: 'string' }>,
    symbol: AbiParameterToPrimitiveType<{ name: 'symbol'; type: 'string' }>,
    contractURI_: AbiParameterToPrimitiveType<{ name: 'contractURI_'; type: 'string' }>,
    _receiver: AbiParameterToPrimitiveType<{ name: '_receiver'; type: 'address' }>,
    feeNumerator: AbiParameterToPrimitiveType<{ name: 'feeNumerator'; type: 'uint96' }>,
];

export const deploy = async () => {
    const [minterWallet] = await hre.viem.getWalletClients();
    const network = hre.network.name;
    const chain = network === 'baseSepolia' ? baseSepolia : bob;
    const publicClient = await hre.viem.getPublicClient();

    for (const id of Object.keys(KUSAMA_KINGDOM_KUSAMA_DETAILS)) {
        const symbol = id.split('-').at(-1) ?? '';
        const name =
            KUSAMA_KINGDOM_KUSAMA_DETAILS[id as keyof typeof KUSAMA_KINGDOM_KUSAMA_DETAILS]
                .collectionMetadataFields.name;

        const args: DeployArgs = [
            minterWallet.account.address,
            name,
            symbol,
            `${KUSAMA_KINGDOM_METADATA_IPFS_BASE}/${id}/contractURI.json`,
            ROYALTY_RECEPIENT ?? minterWallet.account.address,
            BigInt(ROYALTY_BPS),
        ];
        const nftContract = await hre.viem.deployContract('NFT721KusamaKingdom', args);

        console.log(`deployed to ${nftContract.address}`);

        await sleep(10000);
        try {
            await hre.run('verify:verify', {
                address: nftContract.address,
                constructorArguments: args,
                force: false,
            });
        } catch (e) {
            console.warn(e);
        }

        const registryArgs = [
            nftContract.address,
            minterWallet.account.address,
            BigInt(
                KUSAMA_KINGDOM_KUSAMA_DETAILS[id as keyof typeof KUSAMA_KINGDOM_KUSAMA_DETAILS].maxSupply,
            ),
            Erc721Lego,
            0, // None
            false,
            DEFAULT_REGISTRY_CONFIG,
            `${KUSAMA_KINGDOM_METADATA_IPFS_BASE}/${id}/contractURI.json`,
        ] satisfies AbiParametersToPrimitiveTypes<
            ExtractAbiFunction<typeof RMRKRegistry, 'addCollection'>['inputs']
        >;

        const hash = await minterWallet.writeContract({
            address: RMRK_REGISTRY[chain.id],
            abi: RMRKRegistry,
            functionName: 'addCollection',
            args: registryArgs,
        });
        await publicClient.waitForTransactionReceipt({hash});

        await mint({
            id: id as keyof typeof KUSAMA_KINGDOM_KUSAMA_DETAILS,
            address: nftContract.address,
        });

        console.log(`Added ${nftContract.address} to registry`);
    }

    console.log('All done');
};
