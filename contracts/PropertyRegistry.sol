//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract PropertyRegistry is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _propertyIdCounter;

    constructor() ERC721("Real Estate", "REAL") {}

    function mint(string memory tokenURI) public returns (uint256) {
        _propertyIdCounter.increment();

        uint256 newPropertyId = _propertyIdCounter.current();
        _mint(msg.sender, newPropertyId);
        _setTokenURI(newPropertyId, tokenURI);

        return newPropertyId;
    }

    function totalProperties() public view returns (uint256) {
        return _propertyIdCounter.current();
    }
}
