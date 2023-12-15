import { FC, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { NftMetadata, OutletContext } from "../types";
import axios from "axios";
import NftCard from "../components/NftCard";

const GET_AMOUNT = 6;

const Home: FC = () => {
  const [searchTokenId, setSearchTokenId] = useState<number>(0);
  const [totalNFT, setTotalNFT] = useState<Number>(0);
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);

  const { mintNftContract } = useOutletContext<OutletContext>();

  const detectRef = useRef<HTMLDivElement>(null);
  // Ref의 타입 null과 undefined를 다르게 인식해서 초기값을 null 입력
  const observer = useRef<IntersectionObserver>();
  // IntersectionObserver라는 타입

  const observe = () => {
    observer.current = new IntersectionObserver((entries) => {
      if (
        (entries[0].isIntersecting && metadataArray.length !== 0) ||
        // 최초 로딩때 막아주기위해서 !== 0
        searchTokenId <= 0
      ) {
        getNFTs();
      }
    });

    if (!detectRef.current) return;
    // 초기값이 null이라서 그냥 !로 걸러도됨

    observer.current.observe(detectRef.current);
  };

  const getTotalSupply = async () => {
    try {
      if (!mintNftContract) return;
      const TotalSupply = await mintNftContract.methods.totalSupply().call();

      setSearchTokenId(Number(TotalSupply));
      setTotalNFT(Number(TotalSupply));
      // bigint값이니 Number로 감싸기
    } catch (error) {
      console.log(error);
    }
  };

  const getNFTs = async () => {
    try {
      if (!mintNftContract || searchTokenId <= 0) return;

      let temp: NftMetadata[] = [];

      for (let i = 0; i < GET_AMOUNT; i++) {
        if (searchTokenId - i > 0) {
          const metadataURI: string = await mintNftContract.methods
            // @ts-expect-error
            .tokenURI(searchTokenId - i)
            .call();

          const response = await axios.get(metadataURI);

          temp.push({ ...response.data, tokenId: searchTokenId -i });
          // 끝에서부터 가져오니까 i를 빼주면됨
        }
      }

      setSearchTokenId(searchTokenId - GET_AMOUNT);
      setMetadataArray([...metadataArray, ...temp]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTotalSupply();
  }, [mintNftContract]);

  useEffect(() => {
    if (totalNFT === 0) return;

    getNFTs();
  }, [totalNFT]);

  useEffect(() => console.log(metadataArray), [metadataArray]);

  useEffect(() => {
    observe();

    return () => observer.current?.disconnect();
    // 클리어함수는 useEffect에 넣어주자.
  }, [metadataArray]);

  return (
    <div className="grow bg-green-100">
      <ul className=" p-8 grid grid-cols-2 gap-8">
        {metadataArray?.map((v, i) => (
          <NftCard key={i} image={v.image} name={v.name} tokenId={v.tokenId!} />
          // v.tokenId 뒤에 !붙인거는 타입스크립트 문법. 내가 체킹하겠다.
        ))}
      </ul>
      <div ref={detectRef} className="bg-black text-white py-4">
        Detecting Area
      </div>
    </div>
  );
};

export default Home;
