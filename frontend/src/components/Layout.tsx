import { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Web3, { Contract, ContractAbi } from "web3";
import { useSDK } from "@metamask/sdk-react";
// 받아쓰는 임포트

import mintNftAbi from "../abis/mintNftAbi.json";
import Header from "./Header";
// 내가만든 임포트
import saleNftAbi from "../abis/saleNftAbi.json";
import {
  MINT_NFT_CONTRACT,
  SALE_NFT_CONTRACT,
} from "../abis/contractAddresses";

const Layout: FC = () => {
  const [account, setAccount] = useState<string>("");
  // 헤더에 있던 account를 전역변수화 하기위해 전체에 등장하는
  // Layout에 옮기고 헤더에는 프롭스로 내려줌
  const [web3, setWeb3] = useState<Web3>();
  // 우리는 웹3를 유즈스테이트로 쓸거임
  const [mintNftContract, setmintNftContract] =
    useState<Contract<ContractAbi>>();
  const [saleNftContract, setSaleNftContract] =
    useState<Contract<ContractAbi>>();

  const { provider } = useSDK();
  // web3를 꺼내쓰기위한 프로바이더
  // 프로바이더는 장바구니라고 생각. SDK로 부터 장바구니를 가져오고
  // web3라는 정보들을 바구니에 담음

  useEffect(() => {
    if (!provider) return;

    setWeb3(new Web3(provider));
  }, [provider]);

  useEffect(() => {
    if (!web3) return;

    setmintNftContract(
      new web3.eth.Contract(mintNftAbi, MINT_NFT_CONTRACT)
      // web3 생성~
    );
    setSaleNftContract(new web3.eth.Contract(saleNftAbi, SALE_NFT_CONTRACT));
  }, [web3]);

  return (
    <div
      style={{
        backgroundImage: `url('/images/h1.jpg')`,
        backgroundRepeat: "repeat", // 이미지 반복 지정
      }}
    >
      <div className="min-h-screen w-3/5 mx-auto flex flex-col font-style: italic text-amber-500">
        <Header account={account} setAccount={setAccount} />
        <Outlet context={{ account, web3, mintNftContract, saleNftContract }} />
        {/* 아웃렛에서 프롭스 내리는거는 좀 특이함
      아웃렛 자체가 아래에 여러컴포넌트라서 context={} 를 사용하는데
      이게 기본 포맷이고 그안에 객체를 내려주니까 또 {}감싸주는것 */}
      </div>
    </div>
  );
};

export default Layout;
