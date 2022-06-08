// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// import '@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol';
// import '@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import 'base64-sol/base64.sol';

// import '@openzeppelin/contracts/access/Ownable.sol';

contract DynamicSvgNft is ERC721 {
  uint256 private s_tokenCounter;
  string private i_lowImageURI;
  string private i_highImageURI;
  string private constant base64EncodedSvgPrefix = 'data:image/svg+xml;base64,';

  constructor(string memory lowSvg, string memory highSvg)
    ERC721('Dynamic SVG NFT', 'DSN')
  {
    i_lowImageURI = lowSvg;
    i_highImageURI = highSvg;
  }

  function svgToImageURI(string memory svg)
    public
    pure
    returns (string memory)
  {
    string memory svgBase64Encoded = Base64.encode(
      bytes(string(abi.encodePacked(svg)))
    );

    return string(abi.encodePacked(base64EncodedSvgPrefix, svgBase64Encoded));
  }

  function mintNft() public {
    _safeMint(msg.sender, s_tokenCounter);
    s_tokenCounter += 1;
  }
}
