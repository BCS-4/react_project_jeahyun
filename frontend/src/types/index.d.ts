import Web3, { Contract, ContractAbi } from "web3";

export interface OutletContext {
  account: string;
  web3: Web3;
  mintNftContract: Contract<ContractAbi>;
  // 컨트랙트의 타입의 타입
}

export interface NftMetadata {
  tokenId?: number;
  // 토큰아이디만 나중에 추가해서 ?로 추가
  name: string;
  image: string;
  description: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  // 위처럼 배열에 담긴것은 이렇게 타입을 지정함
}
