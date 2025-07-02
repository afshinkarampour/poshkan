import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // روی هر تغییری در مسیر یا پارامترها عمل کن
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search, location.hash]);

  return null;
};

export default ScrollToTop;
