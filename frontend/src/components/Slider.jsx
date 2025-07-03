import React, { useEffect, useState } from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { sliderImages } from "../assets/assets";

import "./sider.css";

const Slider = () => {
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleLeftSlide = (slideIndex) => {
    setCurrentSlide(slideIndex === 0 ? images.length - 1 : slideIndex - 1);
  };

  const handleRightSlide = (slideIndex) => {
    setCurrentSlide(slideIndex === images.length - 1 ? 0 : slideIndex + 1);
  };

  useEffect(() => {
    setImages(sliderImages);
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, 7000);
    return () => clearInterval(slideInterval);
  }, [images.length]);

  return (
    <div className="relative flex items-center justify-center h-[220px] lg:h-[388px]">
      <BiSolidLeftArrow
        className="absolute w-[2rem] h-[2rem] text-white drop-shadow-sm left-[1rem] cursor-pointer z-10"
        onClick={() => handleLeftSlide(currentSlide)}
      />
      <div className="">
        {images && images.length
          ? images.map((imageItem, index) => (
              <div
                key={index}
                className={index === currentSlide ? "slide active" : "slide"}
              >
                {index === currentSlide && (
                  <img
                    alt={imageItem.src}
                    src={imageItem.src}
                    className="rounded-lg w-[100%] h-[100%]"
                    // style={{ display: currentSlide === index ? "block" : "none" }}
                  />
                )}
              </div>
            ))
          : "   "}
      </div>
      <BiSolidRightArrow
        className="absolute w-[2rem] h-[2rem] text-white drop-shadow-sm right-[1rem] cursor-pointer"
        onClick={() => handleRightSlide(currentSlide)}
      />
      <span className="flex absolute bottom-[1rem] m-auto">
        {images && images.length
          ? images.map((_, index) => (
              <button
                key={index}
                className="bg-white h-[15px] w-[15px] rounded-full border-none outline-none mx-1 my-0 pointer"
                style={{
                  backgroundColor: currentSlide === index ? "#15224c" : "#fff",
                }}
                onClick={() => setCurrentSlide(index)}
              ></button>
            ))
          : null}
      </span>
    </div>
  );
};

export default Slider;
