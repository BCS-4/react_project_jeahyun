import { FC, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";

const My: FC = () => {
  const { mintNftContract } = useOutletContext<OutletContext>();
  // outlet프롭스는 useOutletContext쓰면됨 매우간단
  // 타입은 우리가 만든 OutletContext 넣으면 끝

  useEffect(() => {
    console.log(mintNftContract);
  }, [mintNftContract]);

  return <div>My</div>;
};

export default My;
