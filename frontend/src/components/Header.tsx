import { useSDK } from "@metamask/sdk-react";
import { Dispatch, FC, SetStateAction } from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  account: string;
  setAccount: Dispatch<SetStateAction<string>>;
  // 원래는 타입이 React.Dispatch<React.SetStateAction<string>> 이거인데
  // 구조분해써서 리액트 삭제하고 위에 임포트해서 간추림
}

const Header: FC<HeaderProps> = ({ account, setAccount }) => {
  const { sdk } = useSDK();

  const onClickMetaMask = async () => {
    try {
      // if(!sdk) return; 밑에 옵셔널 체이닝 없다면

      const accounts: any = await sdk?.connect();

      setAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="p-2 flex justify-between">
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/my">My</Link>
        <Link to="/sale">Sale</Link>
      </div>
      <div>
        {account ? (
          <>
            <span>
              {account.substring(0, 7)}...
              {account.substring(account.length - 5)}
            </span>
            <button className="ml-2" onClick={() => setAccount("")}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={onClickMetaMask}>MetaMask Login</button>
        )}
      </div>
    </header>
  );
};

export default Header;
