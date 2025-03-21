import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import DashboardSidbar from "../components/DashboardSidbar";
import Orders from "../components/Orders";
import Cart from "./Cart";
import UserInfo from "../components/UserInfo";

const Dashboard = () => {
  const { navigate, userInfo, handleLogOut } = useContext(ShopContext);

  const [showComponent, setShowComponent] = useState("");

  const showProperContent = () => {
    if (showComponent === "userOrders") {
      return <Orders />;
    } else if (showComponent === "userCard") {
      return <Cart />;
    } else if (showComponent === "userInfo") {
      return <UserInfo />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex justify-between sm:justify-around items-center">
        <p>کاربر گرامی {userInfo.name} به پوشکان خوش آمدید</p>
        <button
          onClick={handleLogOut}
          className="px-7 py-1 bg-[#15224c] text-white rounded-md "
        >
          خروج
        </button>
      </div>
      <hr />
      <div className="flex w-full">
        <DashboardSidbar
          userInfo={userInfo}
          setShowComponent={setShowComponent}
          showComponent={showComponent}
        />
        <div className="w-[100%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base">
          <div>{showProperContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
