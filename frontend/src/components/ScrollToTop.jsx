import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Optional: for smooth scrolling
    });
  }, [pathname]); // Re-run effect whenever the pathname changes

  return null; // This component doesn't render anything visible
};

export default ScrollToTop;
