import { FC, useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import MintModal from "../components/MintModal";
import { NftMetadata, OutletContext } from "../types";
import axios from "axios";
import NftCard from "../components/NftCard";



const My: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);

  const { mintNftContract, account } = useOutletContext<OutletContext>();
  // outlet프롭스는 useOutletContext쓰면됨 매우간단
  // 타입은 우리가 만든 OutletContext 넣으면 끝
  const navigate = useNavigate();

  const onClickMintModal = () => {
    if (!account) return;
    setIsOpen(true);
  };

  const getMyNFTs = async () => {
    try {
      if (!mintNftContract || !account) return;
      // @ts-expect-error
      const balance = await mintNftContract.methods.balanceOf(account).call();

      let temp: NftMetadata[] = [];

      for (let i = 0; i < Number(balance); i++) {
        const tokenId = await mintNftContract.methods
          // @ts-expect-error
          .tokenOfOwnerByIndex(account, i)
          .call();

        const metadataURI = await mintNftContract.methods
          // @ts-expect-error
          .tokenURI(Number(tokenId))
          .call();

        // @ts-expect-error
        const response = await axios.get(metadataURI);

        temp.push({ ...response.data, tokenId: Number(tokenId) });
      }
      setMetadataArray(temp);
    } catch (error) {
      console.error(error);
    }
  };

  // 데이터 배열담고 콘솔
  useEffect(() => {
    getMyNFTs();
  }, [mintNftContract, account]);
  useEffect(() => console.log(metadataArray), [metadataArray]);

  useEffect(() => {
    if (account) return;

    navigate("/");
  }, [account]);
  // 로그아웃하면 홈으로 보내버리기

  return (
    <>
      <div className=" grow">
        {/* // grow는 아래까지 전부 덮어버림 */}
        <div className=" text-right p-2">
          <button className="hover:text-gray-500" onClick={onClickMintModal}>
            Mint
          </button>
        </div>
        <div className=" text-center py-8">
          <h1 className="font-bold text-2xl">My NFTs</h1>
        </div>
        <ul className=" p-8 grid grid-cols-2 gap-8">
          {metadataArray?.map((v, i) => (
            <NftCard
              key={i}
              image={v.image}
              name={v.name}
              tokenId={v.tokenId!}
            />
            // v.tokenId 뒤에 !붙인거는 타입스크립트 문법. 내가 체킹하겠다.
          ))}
        </ul>
      </div>
      {isOpen && (
        <MintModal
          setIsOpen={setIsOpen}
          metadataArray={metadataArray}
          setMetadataArray={setMetadataArray}
        />
      )}
    </>
  );
};

export default My;
