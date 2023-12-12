// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MintNFT is ERC721Enumerable {
    string metadataURI;
    uint256 maxSupply;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        string memory _metadataURI
    )
        // memory 변수는 string타입만 넣어주면됨
        ERC721(_name, _symbol)
    {
        maxSupply = _maxSupply;
        metadataURI = _metadataURI;
    }

    function mintNFT() public {
        require(totalSupply() < 500, "No more mint.");
        // 리콰이어는 ()안에 조건,에러메세지 기입
        // 만좀하면 아래것들이 실행됨

        uint256 tokenId = totalSupply() + 1;

        _mint(msg.sender, tokenId);
        // _mint는 기본적으로 internal이라서 배포된시점에서 안보임(컨스트럭터안)
        // 보이게끔 만들어 주려고 public으로 또다시 함수를 실행시키는 옵션을 만든거임(컨스트럭터밖)
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        // override는 부모컨트랙트것을 쓰지않고 우리것을 쓰겠다고 선언한것
        // 마지막에 returns로 반환값을 입력해주는데 타입을 입력해줘야됨 -> string memory
        return
            string(
                abi.encodePacked(
                    metadataURI,
                    "/",
                    Strings.toString(_tokenId),
                    ".json"
                )
            );
    }
}

// uint는 양수만 포함
// int는 음수 양수 다포함

// contract 0xe5eCD09bDe6f6Db77c8f5E10C327a63d4dB73669