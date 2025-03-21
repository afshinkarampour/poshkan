import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Swiper, SwiperSlide } from "swiper/react";

// import required modules
import { FreeMode, Pagination, Navigation } from "swiper/modules";
import { Link, createSearchParams } from "react-router-dom";
import { IoIosArrowDropleft } from "react-icons/io";
import ProductsItems from "./ProductsItems";
import Title from "./Title";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./styles.css";

const LatestCollections = () => {
  const { products, setSpecialName } = useContext(ShopContext);

  const [swiperRef, setSwiperRef] = useState(null);
  const [latestProducts, setLatestProducts] = useState([]);
  const [sliderNumber, setSliderNumber] = useState(2);

  const handleWindowSize = () => {
    if (window.innerWidth <= 280) return 1;
    else if (window.innerWidth > 280 && window.innerWidth <= 480) return 2;
    else if (window.innerWidth > 480 && window.innerWidth <= 768) return 3;
    else if (window.innerWidth > 768 && window.innerWidth <= 1024) return 4;
    if (window.innerWidth > 1024) return 5;
  };

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  useEffect(() => {
    setSliderNumber(handleWindowSize());
  }, [window.innerWidth]);

  return (
    <div className="py-8 lg:px-5">
      <div className="flex items-center justify-between sm:justify-around bg-[#b8e1d3]">
        <div className="text-center text-">
          <Title text1={"جدیدترین"} text2={"محصولات"} />
        </div>
        <div className="flex justify-end py-2">
          <Link
            to={{
              pathname: "/special-products",
              search: `?${createSearchParams({
                special: "special-product",
              })}`,
            }}
            onClick={() => setSpecialName("special-product")}
            className="flex items-center py-2 px-1 bg-[#f01b87] text-white rounded-md text-xs sm:text-md sm:gap-2 "
          >
            مشاهده همه
            <IoIosArrowDropleft size={20} />
          </Link>
        </div>
      </div>
      <div>
        <Swiper
          navigation={true}
          onSwiper={setSwiperRef}
          slidesPerView={sliderNumber}
          spaceBetween={10}
          freeMode={true}
          // pagination={{
          //   clickable: true,
          // }}
          modules={[FreeMode, Pagination, Navigation]}
          className="mySwiper"
        >
          {latestProducts.map((items, index) => (
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
    </div>
  );
};

export default LatestCollections;
