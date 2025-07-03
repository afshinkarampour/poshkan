import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    console.log("gototop1");
    const root = document.getElementById("root");
    root.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    console.log("gototop2");
  }, [pathname]);

  return null;
};

export default ScrollToTop;
