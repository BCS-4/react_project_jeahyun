import { FC, useState } from "react";
import { Link } from "react-router-dom";

interface MyNftCardProps {
  image: string;
  name: string;
  tokenId: number;
}

const MyNftCard: FC<MyNftCardProps> = ({ image, name, tokenId }) => {
  const [isHover, setIsHover] = useState<boolean>(false);

  const onMouseEnter = () => {
    setIsHover(true);
  };
  const onMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <Link to={`/detail/${tokenId}`}>
      <li
        className="relative"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <img src={image} alt={name} />
        <div className="font-semibold mt-1">{name}</div>
        {isHover && (
          <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-50"></div>
        )}
      </li>
      {/* 또다른 호버 사용법 */}
    </Link>
  );
};

export default MyNftCard;
