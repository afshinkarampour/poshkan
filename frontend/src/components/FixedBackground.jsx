import React from "react";
import { assets } from "../assets/assets";

const FixedBackground = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${assets.bg4})`,
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
      className="h-[350px]"
    >
      <div className="w-[100%] h-[100%] bg-slate-950 opacity-50"></div>
    </div>
  );
};

export default FixedBackground;
