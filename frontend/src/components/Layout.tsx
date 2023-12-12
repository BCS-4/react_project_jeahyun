import { FC, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout: FC = () => {
  const [account, setAccount] = useState<string>("");
  // 헤더에 있던 account를 전역변수화 하기위해 전체에 등장하는
  // Layout에 옮기고 헤더에는 프롭스로 내려줌

  return (
    <div className="bg-red-100 min-h-screen max-w-screen-md mx-auto">
      <Header account={account} setAccount={setAccount} />
      <Outlet />
    </div>
  );
};

export default Layout;
