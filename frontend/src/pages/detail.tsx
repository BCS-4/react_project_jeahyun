import { FC, useEffect, useState } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import { NftMetadata, OutletContext } from "../types";
import axios from "axios";

const Detail: FC = () => {
  const [metadata, setMetadata] = useState<NftMetadata>();
  const { tokenId } = useParams();
  // 라우트 끝에 tokenId  가져오기 useParams

  const {} = useOutletContext<OutletContext>();
  const { mintNftContract } = useOutletContext<OutletContext>();

  const navigate = useNavigate();

  const getMyNFT = async () => {
    try {
      if (!mintNftContract) return;

      const metadataURI: string = await mintNftContract.methods
        // @ts-expect-error
        .tokenURI(tokenId)
        .call();

      const response = await axios.get(metadataURI);

      setMetadata(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMyNFT();
  }, [mintNftContract]);

  return (
    <div className="grow  flex justify-center items-center relative">
      <button
        className="absolute top-8 left-8 hover:text-gray-500 "
        onClick={() => navigate(-1)}
        // 네비게이트 훅스로 뒤로가기 구현
      >
        back
      </button>

      {metadata && (
        <div className="w-60">
          <img className="w-60 h-60" src={metadata.image} alt={metadata.name} />
          <div className="font-semibold mt-1">{metadata.name}</div>
          <div className="mt-1">{metadata.description}</div>
          <ul className="mt-1 flex flex-wrap gap-1">
            {metadata.attributes.map((v, i) => (
              <li key={i}>
                <span className="font-semibold">{v.trait_type}</span>
                <span>: {v.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Detail;
