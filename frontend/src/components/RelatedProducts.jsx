import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { FreeMode, Pagination } from "swiper/modules";
import ProductsItems from "./ProductsItems";
import Title from "./Title";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "./styles.css";

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);

  const [related, setRelated] = useState([]);
  const [sliderNumber, setSliderNumber] = useState(2);

  const handleWindowSize = () => {
    if (window.innerWidth <= 280) return 1;
    else if (window.innerWidth > 280 && window.innerWidth <= 480) return 2;
    else if (window.innerWidth > 480 && window.innerWidth <= 768) return 3;
    else if (window.innerWidth > 768 && window.innerWidth <= 1024) return 4;
    if (window.innerWidth > 1024) return 5;
  };

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter(
        (item) => subCategory === item.subCategory
      );
      setRelated(productsCopy);
    }
  }, [products]);

  useEffect(() => {
    setSliderNumber(handleWindowSize());
  }, [window.innerWidth]);

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"محصولات"} text2={"مرتبط"} />
      </div>
      <Swiper
        slidesPerView={sliderNumber}
        spaceBetween={10}
        freeMode={true}
        // pagination={{
        //   clickable: true,
        // }}
        modules={[FreeMode, Pagination]}
        className="mySwiper"
      >
        {related.map((items, index) => (
          <SwiperSlide key={index}>
            <div className=" ">
              <ProductsItems
                id={items._id}
                image={items.img}
                name={items.name}
                price={items.price}
                discount={items.discount}
                warehouseInventory={items.warehouseInventory}
                bottomColor={"bg-[#b8e1d3]"}
                // priceColor="#f5f5f5"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RelatedProducts;
