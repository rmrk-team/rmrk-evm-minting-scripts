// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.21;

import "@rmrk-team/evm-contracts/contracts/implementations/abstract/RMRKAbstractEquippable.sol";

error LengthMismatch();

contract Kanaria is RMRKAbstractEquippable {
    mapping(address => bool) private _autoAcceptCollection;

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

    function batchMintById(
        address to,
        uint256[] memory tokenIds,
        string[] memory metadataURIs,
        address catalogAddress,
        uint64[][] memory partIds
    ) public virtual onlyOwnerOrContributor {
        _totalSupply += tokenIds.length;
        if (_totalSupply > _maxSupply) revert RMRKMintOverMax();

        for (uint256 i; i < tokenIds.length; ) {
            unchecked {
                ++_totalAssets;
            }

            _safeMint(to, tokenIds[i], "");

            uint64 assetId = uint64(_totalAssets);
            uint256 tokenId = tokenIds[i];
            _addAssetEntry(
                assetId,
                0,
                catalogAddress,
                metadataURIs[i],
                partIds[i]
            );

            _addAssetToToken(tokenId, assetId, 0);
            _acceptAsset(tokenId, 0, assetId);

            unchecked {
                ++i;
            }
        }
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

    function contractURI() public view returns (string memory) {
        return collectionMetadata();
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        _requireMinted(tokenId);
        // We add asset on mint, so it always has at least one
        return getAssetMetadata(tokenId, _activeAssets[tokenId][0]);
    }

    function lockSupply() public virtual onlyOwnerOrContributor {
        _maxSupply = _totalSupply;
    }

    function setAutoAcceptCollection(
        address collection,
        bool autoAccept
    ) public virtual onlyOwner {
        _autoAcceptCollection[collection] = autoAccept;
    }

    function _afterAddChild(
        uint256 tokenId,
        address childAddress,
        uint256 childId,
        bytes memory
    ) internal override {
        // Auto accept children if they are from known collections
        if (_autoAcceptCollection[childAddress]) {
            _acceptChild(
                tokenId,
                _pendingChildren[tokenId].length - 1,
                childAddress,
                childId
            );
        }
    }

    function _afterAddAssetToToken(
        uint256 tokenId,
        uint64 assetId,
        uint64 replacesAssetWithId
    ) internal virtual override {
        // Remove auto accept mechanism from RMRKAbstractEquippable, we will handle it here
    }
}
