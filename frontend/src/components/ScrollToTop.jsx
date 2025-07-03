import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    //وقتی با Link to بین صفحات جابجا میشیم، اسکرول رو به بالا میبره
    document.querySelector("#root").scrollIntoView();
  }, [pathname]);

  return null;
};

export default ScrollToTop;
