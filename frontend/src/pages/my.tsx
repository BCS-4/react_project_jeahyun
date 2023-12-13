import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MintModal from "../components/MintModal";
import { OutletContext } from "./types";

const My: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mintNftContract, account } = useOutletContext<OutletContext>();
  // outlet프롭스는 useOutletContext쓰면됨 매우간단
  // 타입은 우리가 만든 OutletContext 넣으면 끝
  const onClickMintModal = () => {
    if (!account) return;
    setIsOpen(true);
  };

  useEffect(() => {
    console.log(mintNftContract);
  }, [mintNftContract]);

  return (
    <>
      <div className="bg-green-500 grow">
        {/* // grow는 아래까지 전부 덮어버림 */}
        <div className="bg-purple-100 text-right p-2">
          <button className="hover:text-gray-500" onClick={onClickMintModal}>
            Mint
          </button>
        </div>
      </div>
      {isOpen && <MintModal setIsOpen={setIsOpen} />}
    </>
  );
};

export default My;
