// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import "@rmrk-team/evm-contracts/contracts/implementations/abstract/RMRKAbstractEquippable.sol";

error LengthMismatch();

abstract contract KanariaItemsBase is RMRKAbstractEquippable {
    constructor(
        string memory name,
        string memory symbol,
        string memory collectionMetadata,
        uint256 maxSupply,
        address royaltyRecipient,
        uint16 royaltyBps
    )
        RMRKImplementationBase(
            name,
            symbol,
            collectionMetadata,
            maxSupply,
            royaltyRecipient,
            royaltyBps
        )
    {}

    function batchAddEquippableAssetEntries(
        uint64 equippableGroupId,
        string[] memory metadataURI
    ) public virtual onlyOwnerOrContributor {
        uint256 length = metadataURI.length;
        for (uint256 i; i < length; ) {
            unchecked {
                ++_totalAssets;
            }
            _addAssetEntry(
                uint64(_totalAssets),
                equippableGroupId,
                address(0),
                metadataURI[i],
                new uint64[](0)
            );
            unchecked {
                ++i;
            }
        }
    }

    function batchNestMintWithAssets(
        address parentContract,
        uint256 destinationId,
        uint64[][] memory assetIds
    ) public virtual onlyOwnerOrContributor {
        uint256 length = assetIds.length;
        (uint256 nextToken, uint256 totalSupplyOffset) = _prepareMint(length);

        for (uint256 tokenId = nextToken; tokenId < totalSupplyOffset; ) {
            _nestMintWithAssets(
                parentContract,
                tokenId,
                destinationId,
                assetIds[tokenId - nextToken]
            );
            unchecked {
                ++tokenId;
            }
        }
    }

    function nestMintWithAssets(
        address parentContract,
        uint256 destinationId,
        uint64[] memory assetIds
    ) public virtual onlyOwnerOrContributor {
        (uint256 tokenId, ) = _prepareMint(1);
        _nestMintWithAssets(parentContract, tokenId, destinationId, assetIds);
    }

    function _nestMintWithAssets(
        address parentContract,
        uint256 tokenId,
        uint256 destinationId,
        uint64[] memory assetIds
    ) internal virtual {
        uint256 length = assetIds.length;
        _nestMint(parentContract, tokenId, destinationId, "");
        for (uint256 i; i < length; ) {
            _addAssetToToken(tokenId, assetIds[i], 0);
            _acceptAsset(tokenId, 0, assetIds[i]);
            unchecked {
                ++i;
            }
        }
    }

    function lockSupply() public virtual onlyOwnerOrContributor {
        _maxSupply = _totalSupply;
    }

    function _afterAddAssetToToken(
        uint256 tokenId,
        uint64 assetId,
        uint64 replacesAssetWithId
    ) internal virtual override {
        // Remove auto accept mechanism from RMRKAbstractEquippable, we will handle it here
    }
}
