import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // console.log("go to top1");

    // window.scrollTo({
    //   top: 0,
    //   left: 0,
    //   behavior: "smooth",
    // });

    // console.log("go to top2");
    document.querySelector("#root").scrollIntoView();
  }, [pathname]);

  return null;
};

export default ScrollToTop;
