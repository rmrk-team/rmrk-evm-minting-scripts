// SPDX-License-Identifier: GNU GPLv3
pragma solidity ^0.8.21;

import "@rmrk-team/evm-contracts/contracts/implementations/catalog/RMRKCatalogImpl.sol";
// So typechain catches it:
import "@rmrk-team/evm-contracts/contracts/RMRK/utils/RMRKEquipRenderUtils.sol";

contract KanariaCatalog is RMRKCatalogImpl {
    constructor(
        string memory metadataURI,
        string memory type_
    ) RMRKCatalogImpl(metadataURI, type_) {}
}
