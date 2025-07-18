// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ConsentToken is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct ConsentData {
        address recipient;
        string purpose;
        uint256 expiryDate;
        bool isRevoked;
        string website;
        string dataFields;
    }

    mapping(uint256 => ConsentData) public consentData;
    mapping(address => uint256[]) public userTokens;

    event ConsentMinted(
        uint256 indexed tokenId,
        address indexed issuer,
        address indexed recipient,
        string purpose,
        uint256 expiryDate,
        string website,
        string dataFields
    );

    event ConsentRevoked(uint256 indexed tokenId, address indexed issuer);

    constructor() ERC721("Consent Token", "CONSENT") {}

    function mintConsent(
        address recipient,
        string memory purpose,
        uint256 expiryDate,
        string memory website,
        string memory dataFields
    ) external {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);

        consentData[newTokenId] = ConsentData({
            recipient: recipient,
            purpose: purpose,
            expiryDate: expiryDate,
            isRevoked: false,
            website: website,
            dataFields: dataFields
        });

        userTokens[msg.sender].push(newTokenId);

        emit ConsentMinted(
            newTokenId,
            msg.sender,
            recipient,
            purpose,
            expiryDate,
            website,
            dataFields
        );
    }

    function revokeConsent(uint256 tokenId) external {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");
        require(!consentData[tokenId].isRevoked, "Already revoked");

        consentData[tokenId].isRevoked = true;

        emit ConsentRevoked(tokenId, msg.sender);
    }

    function getMyConsents(address owner) external view returns (ConsentData[] memory) {
        uint256[] memory tokenIds = userTokens[owner];
        ConsentData[] memory consents = new ConsentData[](tokenIds.length);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            consents[i] = consentData[tokenIds[i]];
        }

        return consents;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return string(abi.encodePacked("https://api.consentwallet.com/token/", _toString(tokenId)));
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
} 