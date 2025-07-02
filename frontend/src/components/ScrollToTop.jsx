import { useEffect } from "react";
import { useParams } from "react-router-dom";

const ScrollToTop = () => {
  const { productId } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  return null;
};

export default ScrollToTop;
