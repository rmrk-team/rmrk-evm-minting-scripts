// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.21;

import "./KanariaItemsBase.sol";

contract KanariaItems is KanariaItemsBase {
    constructor(
        string memory name,
        string memory symbol,
        string memory collectionMetadata,
        uint256 maxSupply,
        address royaltyRecipient,
        uint16 royaltyBps
    )
        KanariaItemsBase(
            name,
            symbol,
            collectionMetadata,
            maxSupply,
            royaltyRecipient,
            royaltyBps
        )
    {}

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        _requireMinted(tokenId);
        // We add asset on mint, so it always has at least one
        return getAssetMetadata(tokenId, _activeAssets[tokenId][0]);
    }

    function batchAddAdditionalAssets(
        uint256[] memory tokenIds,
        string[] memory metadataURIs
    ) public onlyOwnerOrContributor {
        uint256 length = tokenIds.length;
        if (length != metadataURIs.length) revert LengthMismatch();

        for (uint256 i; i < length; ) {
            unchecked {
                ++_totalAssets;
            }
            uint64 assetId = uint64(_totalAssets);
            uint256 tokenId = tokenIds[i];

            _addAssetEntry(
                assetId,
                0,
                address(0),
                metadataURIs[i],
                new uint64[](0)
            );

            _addAssetToToken(tokenId, assetId, 0);
            _acceptAsset(tokenId, _pendingAssets[tokenId].length - 1, assetId);

            unchecked {
                ++i;
            }
        }
    }

    function batchMintWithAssets(
        address to,
        uint64[][] memory assetIds
    ) public virtual onlyOwnerOrContributor {
        uint256 length = assetIds.length;
        (uint256 nextToken, uint256 totalSupplyOffset) = _prepareMint(length);

        for (uint256 tokenId = nextToken; tokenId < totalSupplyOffset; ) {
            _mintWithAssets(to, tokenId, assetIds[tokenId - nextToken]);
            unchecked {
                ++tokenId;
            }
        }
    }

    function mintWithAssets(
        address to,
        uint64[] memory assetIds
    ) public virtual onlyOwnerOrContributor {
        (uint256 tokenId, ) = _prepareMint(1);
        _mintWithAssets(to, tokenId, assetIds);
    }

    function _mintWithAssets(
        address to,
        uint256 tokenId,
        uint64[] memory assetIds
    ) internal virtual {
        _safeMint(to, tokenId, "");
        for (uint256 i; i < assetIds.length; ) {
            _addAssetToToken(tokenId, assetIds[i], 0);
            _acceptAsset(tokenId, 0, assetIds[i]);
            unchecked {
                ++i;
            }
        }
    }
}
