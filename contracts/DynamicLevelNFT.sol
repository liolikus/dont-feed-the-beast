// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title DynamicLevelNFT
 * @dev NFT with dynamic leveling by burning MON (native token on Monad testnet)
 */
contract DynamicLevelNFT is ERC721, Ownable {
    uint256 public constant MAX_LEVEL = 10;
    uint256 public constant MINT_FEE = 0.1 ether; // 0.1 MON for minting
    uint256 public nextTokenId;

    // Mapping from tokenId to current level (1-10)
    mapping(uint256 => uint256) public tokenLevel;
    // Mapping to track if an address has already minted
    mapping(address => bool) public hasMinted;

    event Minted(address indexed to, uint256 indexed tokenId);
    event LeveledUp(address indexed owner, uint256 indexed tokenId, uint256 newLevel);

    constructor() ERC721("DON'T FEED THE BEAST", "DFTB") Ownable(msg.sender) {}

    function mint() external payable {
        require(!hasMinted[msg.sender], "Only one NFT per wallet allowed");
        require(msg.value == MINT_FEE, "Minting requires 0.1 MON");
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);
        tokenLevel[tokenId] = 1;
        hasMinted[msg.sender] = true;
        emit Minted(msg.sender, tokenId);
        // Burn MON by sending to address(0)
        (bool sent, ) = address(0).call{value: msg.value}("");
        require(sent, "Failed to burn MON");
    }

    function levelUp(uint256 tokenId) external payable {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        uint256 currentLevel = tokenLevel[tokenId];
        require(currentLevel < MAX_LEVEL, "Already at max level");
        uint256 nextLevel = currentLevel + 1;
        uint256 requiredFee = 0.1 ether + (nextLevel * 0.1 ether);
        require(msg.value == requiredFee, "Incorrect MON for level up");
        tokenLevel[tokenId] = nextLevel;
        emit LeveledUp(msg.sender, tokenId, nextLevel);
        // Burn MON by sending to address(0)
        (bool sent, ) = address(0).call{value: msg.value}("");
        require(sent, "Failed to burn MON");
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        uint256 level = tokenLevel[tokenId];
        string memory name = string(abi.encodePacked("Salmon Level: ", _toString(level)));
        string memory description = "starving salmonade.";
        string memory image;
        if (level == 1) image = "https://github.com/liolikus/dont-feed-the-beast/raw/main/salmonade_level_1.png";
        else if (level == 2) image = "https://github.com/liolikus/dont-feed-the-beast/raw/main/salmonade_level_2.png";
        else if (level == 3) image = "https://github.com/liolikus/dont-feed-the-beast/raw/main/salmonade_level_3.png";
        else if (level == 4) image = "https://github.com/liolikus/dont-feed-the-beast/raw/main/salmonade_level_4.png";
        else if (level == 5) image = "https://github.com/liolikus/dont-feed-the-beast/raw/main/salmonade_level_5.png";
        else if (level == 6) image = "https://github.com/liolikus/dont-feed-the-beast/raw/main/salmonade_level_6.png";
        else if (level == 7) image = "https://github.com/liolikus/dont-feed-the-beast/raw/main/salmonade_level_7.png";
        else if (level == 8) image = "https://github.com/liolikus/dont-feed-the-beast/raw/main/salmonade_level_8.png";
        else if (level == 9) image = "https://github.com/liolikus/dont-feed-the-beast/raw/main/salmonade_level_9.png";
        else if (level == 10) image = "https://github.com/liolikus/dont-feed-the-beast/raw/main/salmonade_level_10.png";
        
        string memory json = string(abi.encodePacked(
            '{',
                '"name":"', name, '",',
                '"description":"', description, '",',
                '"image":"', image, '",',
                '"attributes":[',
                    '{"trait_type":"Level","value":', _toString(level), '}',
                ']'
            '}'
        ));
        string memory base64Json = Base64.encode(bytes(json));
        return string(abi.encodePacked("data:application/json;base64,", base64Json));
    }

    // Helper to convert uint to string
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