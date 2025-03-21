import React, { useEffect } from "react";

const Welcome = () => {
  // useEffect(() => {
  //   {
  //     if (
  //       !localStorage.getItem("isLogin") ||
  //       localStorage.getItem("isLogin") === "false" ||
  //       isLogin === false
  //     )
  //       return;
  //     <Login />;
  //   }
  // }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-5 pt-7 text-[#15224c] lg:text-2xl">
      <p>به صفحه مدیریت پوشکان خوش آمدید.</p>
    </div>
  );
};

export default Welcome;
