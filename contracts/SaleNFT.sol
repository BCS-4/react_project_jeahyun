// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./MintNFT.sol";

contract SaleNFT {
    // 판매 등록
    // 아래 uint => uint는 tokenId=> price
    mapping(uint256 => uint256) public nftPrices;
    // 매핑은 1:1 매칭시켜주는 역할

    uint256[] public onSaleNFTs;

    function setForSaleNFT(
        address _mintNftAddress,
        uint256 _tokenId,
        uint256 _price
    ) public {
        ERC721 mintNftContract = ERC721(_mintNftAddress);
        // address로 받아온 주소를 바로 쓸수가 없음.
        // 그래서 ERC721로 감싸서 사용할수 있게 바꿈
        // Deploy의 At Address에 주소를 넣는게 가능함.
        address nftOwner = mintNftContract.ownerOf(_tokenId);
        // .call은 js쓰는거고 여기는 soludity라서 call send가 없음

        require(msg.sender == nftOwner, "caller is not NFT owner.");
        // ,앞은 정상일때 ,뒤는 비정상일떄
        require(_price > 0, "Price is zeor or lower.");
        require(nftPrices[_tokenId] == 0, "This NFT is already on sale.");
        require(
            mintNftContract.isApprovedForAll(msg.sender, address(this)),
            "NFT Owner did not approve token"
            // msg.sender는 함수 실행시킨사람
        );

        nftPrices[_tokenId] = _price;
        // tokenId에 가격 등록

        onSaleNFTs.push(_tokenId);
        // 배열 가장 마지막 요소에 추가
    }

    // 구매   (컨트랙트 주소, 토큰 id ,가격 ,구매자)
    function purchaseNFT(address _mintNftAddress, uint256 _tokenId)
        public
        payable
    {
        ERC721 mintNftContract = ERC721(_mintNftAddress);
        address nftOwner = mintNftContract.ownerOf(_tokenId);
        // 컨트랙트 등록 및 주인 불러오기

        require(msg.sender != nftOwner, "Call is NFT owner.");
        require(nftPrices[_tokenId] > 0, "This nft not sale.");
        require(
            nftPrices[_tokenId] <= msg.value,
            " Caller sent lower than price."
        );
        payable(nftOwner).transfer(msg.value);

        mintNftContract.safeTransferFrom(nftOwner, msg.sender, _tokenId);

        nftPrices[_tokenId] = 0;

        checkZeroPrice();
    }

    function checkZeroPrice() public {
        for (uint256 i = 0; i < onSaleNFTs.length; i++) {
            if (nftPrices[onSaleNFTs[i]] == 0) {
                onSaleNFTs[i] = onSaleNFTs[onSaleNFTs.length - 1];
                // 팔린 nft를 맨끝의 nft를 복사해서 담고 맨 끝의 복사된 NFT를 삭제
                onSaleNFTs.pop();
            }
        }
    }

    function getOnSaleNFTs() public view returns(uint[] memory) {
        return onSaleNFTs;
    }
}

// NFT소유자가 판매컨트랙트에 권한을 부여하면서 판매

// 최종적으로 Mintcontract에서 setApprovalForAll에서 salecontract에 
// 권한을주면됨