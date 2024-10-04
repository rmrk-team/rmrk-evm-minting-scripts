// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.21;

// Import the openzepplin contracts
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// NFTee is  ERC721 signifies that the contract we are creating imports ERC721 and follows ERC721 contract from openzeppelin
contract NFT721KusamaKingdom is ERC721Royalty, ERC721URIStorage, ERC721Burnable, Ownable {
    string internal _contractURI;
    address private _royaltyRecipient;
    uint256 private _royaltyPercentageBps;

    constructor(address initialOwner, string memory name, string memory symbol, string memory contractURI_, address _receiver, uint96 feeNumerator) ERC721(name, symbol) Ownable(initialOwner) {
        _contractURI = contractURI_;
        _setDefaultRoyalty(_receiver, feeNumerator);
        _setRoyaltyRecipient(_receiver);
        _royaltyPercentageBps = feeNumerator;
    }

    /**
     * @notice Used to update the royalty recipient.
     * @param newRoyaltyRecipient Address of the new recipient of royalties
     */
    function _setRoyaltyRecipient(address newRoyaltyRecipient) internal {
        _royaltyRecipient = newRoyaltyRecipient;
    }

    function safeMint(address to, uint256 tokenId, string memory uri) public onlyOwner {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    /**
    * @notice Used to retrieve the metadata URI of the collection.
     * @return contractURI_ string The metadata URI of the collection
     */
    function contractURI() public view virtual returns (string memory contractURI_) {
        contractURI_ = _contractURI;
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @notice Used to retrieve the recipient of royalties.
     * @return recipient Address of the recipient of royalties
     */
    function getRoyaltyRecipient() public view virtual returns (address recipient) {
        recipient = _royaltyRecipient;
    }

    /**
     * @notice Used to retrieve the specified royalty percentage.
     * @return royaltyPercentageBps The royalty percentage expressed in the basis points
     */
    function getRoyaltyPercentage() public view virtual returns (uint256 royaltyPercentageBps)
    {
        royaltyPercentageBps = _royaltyPercentageBps;
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Royalty, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
