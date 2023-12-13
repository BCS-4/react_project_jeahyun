import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MintModal from "../components/MintModal";
import { NftMetadata, OutletContext } from "./types";
import axios from "axios";

const My: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);

  const { mintNftContract, account } = useOutletContext<OutletContext>();
  // outlet프롭스는 useOutletContext쓰면됨 매우간단
  // 타입은 우리가 만든 OutletContext 넣으면 끝
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

        temp.push(response.data);
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
            <li key={i}>
              <img className="w-60 h-60 " src={v.image} alt={v.name} />
              <div className="font-semibold mt-1">{v.name}</div>
            </li>
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
