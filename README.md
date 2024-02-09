# RMRK EVM Minting scripts

A collection of scripts for composable RMRK NFTs.

This repository will contain a common re-usable examples as well as real-world scripts that RMRK team actually use for
production minting. We thought that sharing the actual scripts that we use can be beneficial for the community.

This project uses [Hardhat](https://hardhat.org/) with [Viem](https://viem.sh/) instead of traditional ethers.js. You
can find more information on using hardhat with
viem [here](https://hardhat.org/hardhat-runner/docs/advanced/using-viem.html).
This project also uses ESM instead of commonjs, which is currently not fully supported by hardhat, which uses ts-node
under the
hood. [This experimental workaround](https://github.com/NomicFoundation/hardhat/issues/3385#issuecomment-1841380253) was
used to enable full ESM support in hardhat project

## Installation

This project uses pnpm as package manager. You can use npm or yarn as well, but we recommend sticking with pnpm.

```bash
pnpm install
```

Copy `.env.example` to `.env` and set your environment variables as needed.

## Usage

Because ESM is
an [experimental feature in hardhat]([This experimental workaround](https://github.com/NomicFoundation/hardhat/issues/3385#issuecomment-1841380253))
for now, running hardhat scripts requires a longer command with extra arguments, therefore it is abstracted into a
script in package.json. So instead of the usual `pnpm hardhat run ...` you need to run hardhat scripts
using `pnpm script ...`

### Some conventions

- To avoid accidently running a script by importing something from another script, we recommend adding a code that actually runs the script in a file with `-entry.ts` prepended to it's name

```typescript
// manage-contributor-entry.ts
manageContributorEntry().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

- For scripts that iterate through input data and send a transaction for each iteration, we strongy recommend saving transaction result logs on each iteration, rather than waiting until the loop finishes. Transaction can fail for many reasons, including running out of gas or wallet's nonce being used by another script or wallet extension while script is running. We use `ndjosn` file format to append log entry on every iteration.

```typescript
// Get existing minted batches logs, or create the file if it doesn't exist
const alreadyMintedBatches = await getOrCreateNdjosnLogFile<LogEntry>(logFilePath);

for (const batchMintWithAssetsIdsInputData of batchMintWithAssetsIdsInputDataArray) {
    const { contractAddress, to, assetIds } = batchMintWithAssetsIdsInputData;
    const uniqueLogIdentifier = `${contractAddress}-${assetIds[0][0].toString()}-${assetIds[assetIds.length - 1][0].toString()}`;

    // Check if this batch has already been minted
    if (alreadyMintedBatches.find((batch) => !!batch[uniqueLogIdentifier])) {
        console.warn(
            `Log for this identifier already exists ${uniqueLogIdentifier}. Skipping`,
            { batchMintWithAssetsIdsInputData },
        );
        continue;
    }
    
    //...some transaction logic that returns hash

    const logEntry: LogEntry = {
        [uniqueLogIdentifier]: {
            inputData: batchMintWithAssetsIdsInputData,
            hash,
            tokenIds,
        },
    };

    await fs.promises.appendFile(
        logFilePath,
        `${jsonStringifyWithBigint(logEntry)}\n`,
    );
}
```

See [scripts/batch-mint-with-assets-ids.ts](scripts/batch-mint-with-assets-ids.ts) for a full example.

While this can feel like a lot of repetition for each script, this can save you a lot of time and headache when you need resume the script after it fails in the middle of the loop.

*The code to save transacton logs, and code that gets fields from event logs of transaction receipt should ideally be abstracted into a re-usable functions. If you wish to contribute to this project, then this is a good candidate for contribution*

### Example of minting Kanaria Base network campaign rewards

See [scripts/mint-kanaria-base-network-campaign-rewards-entry.ts](scripts/mint-kanaria-base-network-campaign-rewards-entry.ts) For a complete example of scripts to mint new equippable Kanaria NFTs. It consists of 4 separate scripts.
1. pin metadata to ipfs using filebase sdk
2. add equippable asset entries for each new equippable asset to "Kanaria Champions" kanaria items contract
3. batch nest mint with existing asset ids using `ItemsBatchMinter` contract. `ItemsBatchMinter` is a utility contract with contributor role allowing him to mint nfts in Kanaria item contracts. We use `batchNestMintTokensWithExistingAsset` method to mint multiple NFTs in a single transaction with same assetId but different destination NFT ids, allowing NFT to be minted directly on Kanaria with new asset already added and accepted to NFTs. Please bear in mind that you won't be able to run the same scripts on Kanaria, as your private key will not have appropriate contributor role to interact with Kanaria contracts.
4. batch mint more NFTs directly to an account (as opposed to nest minting directly to Kanaria NFT like in step 3). KanariaItems contracts have a custom method `batchMintWithAssets` that allows you to mint multiple NFTs each with a different (or the same) asset to a single account in a single transaction.

The entry point script `scripts/mint-migration-reward-nfts-entry.ts` has multiple scripts, and you can comment required step at the bottom of the file, then comment it back and uncomment the next one, once the previous script has finished running.

```bash
pnpm script scripts/mint-migration-reward-nfts-entry.ts --network base
```

## TODO

This repository is a work in progress. We will be adding more examples and real-world scripts as we go. Feel free to contribute with a PR. This projects structure is also coming to [@rmrk-team/evm-template](https://github.com/rmrk-team/evm-template) soon for an easy one click starter project.

