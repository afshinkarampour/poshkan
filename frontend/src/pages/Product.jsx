import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { IoIosStar } from "react-icons/io";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import UserSizeGuide from "../components/UserSizeGuide";
import UserGuideAfterAddedToCart from "../components/UserGuideAfterAddedToCart";
import ScrollToTop from "../components/ScrollToTop";

const Product = () => {
  const { productId } = useParams();

  const {
    products,
    currency,
    addToCart,
    convertToPersianDigits,
    formatAmount,
    backendUrl,
    showDialogBox,
  } = useContext(ShopContext);

  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [features, setFeatures] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showUserSizeGuide, setShowUserSizeGuide] = useState(false);

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(
          // assets.product1 || item.img[0].substring(0, item.img[0].indexOf("?"))
          item.img[0]
        );
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  // useEffect(() => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // }, [productId]);

  useLayoutEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 50); // کمی تأخیر تا مرورگر کاملاً DOM رو رندر کنه
  }, [productData]);

  useEffect(() => {
    if (productData) {
      const newFeatures = [];

      // Group by color
      productData.features.forEach((feature) => {
        // Find if the color already exists in the newFeatures array
        let colorGroup = newFeatures.find(
          (item) => item.color === feature.color
        );

        if (!colorGroup) {
          // If the color group doesn't exist, create a new one
          colorGroup = { color: feature.color, sizes: [], count: 0 };
          newFeatures.push(colorGroup);
        }

        // Add the size to the sizes array if it's not already there
        if (!colorGroup.sizes.includes(feature.size)) {
          colorGroup.sizes.push(feature.size);
        }

        // Add the count to the total count for that color
        colorGroup.count += feature.count;
      });
      setFeatures(newFeatures);
    }
  }, [productData]);

  const onCloseHandler = () => {
    setShowUserSizeGuide(false);
  };

  const onOpenHandler = () => {
    setShowUserSizeGuide(true);
  };

  const onAddtoCartHnadel = (product, size, color) => {
    if (color === null) {
      toast.error("رنگ مورد نظر خود را انتحاب کنید");
      return;
    }

    if (size === null) {
      toast.error("سایز مورد نظر خود را انتحاب کنید");
      return;
    }

    if (product.warehouseInventory <= 0) {
      toast.error("در حال حاضر این محصول موجود نمی‌باشد.");
      return;
    }

    for (let i = 0; i < product.features.length; i++)
      if (
        product.features[i].color === color &&
        product.features[i].size === size
      ) {
        addToCart(product._id, size, color, product.features[i].count);
      }
  };

  return productData ? (
    <div>
      <ScrollToTop />
      <div className="relative border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
        <div
          className="relative"
          style={{ display: showUserSizeGuide ? "block" : "none" }}
        >
          <UserSizeGuide
            sizeGuides={productData.userSizeGuide}
            closeHandler={onCloseHandler}
            openHandler={onOpenHandler}
            showUserSizeGuide={showUserSizeGuide}
          />
        </div>
        <div
          className="relative"
          style={{ display: showDialogBox ? "block" : "none" }}
        >
          <UserGuideAfterAddedToCart showDialogBox={showDialogBox} />
        </div>
        {/* ------------------Product Data------------------ */}
        <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
          {/* -----------------Product Images--------------- */}
          <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
            <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal w-full sm:w-[18.7%]">
              {productData.img.length !== 0
                ? productData.img.map((item, index) => (
                    <img
                      onClick={
                        () => setImage(item)
                        // setImage(item.substring(0, item.indexOf("?")))
                      }
                      // src={item.substring(0, item.indexOf("?"))}
                      src={`${backendUrl}/uploads/${item}`}
                      key={index}
                      className="w-[30%] sm:w-full sm-full sm:mb-3 flex-shrink-0 cursor-pointer overflow-hidden"
                      alt=""
                    />
                  ))
                : ""}
            </div>
            <div className="relative w-full sm:w-[80%] overflow-hidden group">
              <img
                className="w-full h-auto transform group-hover:scale-125 transition-transform duration-500 ease-in-out"
                src={`${backendUrl}/uploads/${image}`}
                alt=""
              />
              <div
                style={{
                  display:
                    productData.discount !== null &&
                    productData.discount > 0 &&
                    productData.warehouseInventory > 0
                      ? "block"
                      : "none",
                }}
                className={`absolute top-3 right-0 py-1 px-4 text-white rounded-l-full bg-[#f01b87]`}
              >
                {productData.discount
                  ? convertToPersianDigits(
                      Math.round(
                        ((productData.price - productData.discount) /
                          productData.price) *
                          100
                      )
                    )
                  : ""}{" "}
                %
              </div>
              <div
                style={{
                  display:
                    productData.warehouseInventory <= 2 &&
                    productData.warehouseInventory > 0
                      ? "block"
                      : "none",
                }}
                className="absolute bottom-30 right-0 left-0 bg-[#15224c] text-white text-[12px] text-center opacity-90"
              >
                فقط {convertToPersianDigits(productData.warehouseInventory)} عدد
                در انبار باقی مانده است
              </div>
            </div>
          </div>
          {/* ---------Product Info--------------- */}
          <div className="px-4 sm:px-0 flex-1">
            <h1 className="font-medium text-2xl mt-2">
              {convertToPersianDigits(productData.name)}
            </h1>
            {/* <div className="flex items-center gap-1 mt-2">
              <IoIosStar size={20} className="text-yellow-500 w-3.5" />
              <IoIosStar size={20} className="text-yellow-500 w-3.5" />
              <IoIosStar size={20} className="text-yellow-500 w-3.5" />
              <IoIosStar size={20} className="text-yellow-500 w-3.5" />
              <IoIosStar size={20} className="text-yellow-100 w-3.5" />
              <p className="pl-2">(122)</p>
            </div> */}
            <div
              style={{
                display: productData.warehouseInventory > 0 ? "block" : "none",
              }}
            >
              <p className="mt-5 text-2xl font-medium text-red-400">
                {productData.discount
                  ? convertToPersianDigits(formatAmount(productData.discount))
                  : convertToPersianDigits(
                      formatAmount(productData.price)
                    )}{" "}
                {currency}
              </p>
              <p className="line-through">
                {productData.discount
                  ? convertToPersianDigits(formatAmount(productData.price))
                  : ""}{" "}
                {productData.discount ? currency : ""}
              </p>
              {/* <p className="mt-5 text-gray-500 md:w-4/5">
                {productData.description}
              </p> */}
            </div>
            <div
              style={{
                display: productData.warehouseInventory <= 0 ? "block" : "none",
              }}
              className="py-6 text-red-500"
            >
              درحال حاضر این محصول موجود نمی‌باشد
            </div>
            <div className="my-8">
              <div className="flex items-center gap-20">
                <p> انتخاب رنگ و سایز</p>
                <button
                  onClick={() => setShowUserSizeGuide(true)}
                  className="text-sm text-slate-800 px-5 py-2 hover:bg-[#15224c] duration-500 hover:text-white hover:border hover:border-sky-800 rounded-sm border border-slate-800"
                >
                  راهنمای انتخاب سایز
                </button>
              </div>
              <div className="">
                {features.map((item, index) => {
                  if (item.count > 0) {
                    return (
                      <div key={index} className="mb-2">
                        {/* Color box */}
                        <div
                          onClick={() => {
                            setSelectedColor(
                              selectedColor === item.color ? null : item.color
                            );
                          }}
                          className={`bg-slate-100 py-2 w-16 h-10 cursor-pointer border ${
                            selectedColor === item.color
                              ? "border-slate-400"
                              : ""
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            {item.color}
                          </div>
                        </div>
                        {/* Sizes for the selected color */}
                        {selectedColor === item.color && (
                          <div className="mt-2 mr-8">
                            <p className="text-sm">
                              سایزهای موجود برای رنگ {item.color}
                            </p>
                            <div className="flex gap-2">
                              {item.sizes.map((size, sizeIndex) => (
                                <div
                                  key={sizeIndex}
                                  onClick={() => {
                                    setSelectedSize(
                                      selectedSize === size ? null : size
                                    );
                                  }}
                                  className={`flex items-center justify-center h-10 w-12 text-sm bg-slate-100 p-1 rounded border cursor-pointer ${
                                    selectedSize === size
                                      ? "border-slate-400"
                                      : ""
                                  }`}
                                >
                                  {size}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            </div>
            <p className="py-2 text-[13px] text-[#15224c]">
              راهنمای انتخاب سایز را مطالعه فرمائید
            </p>
            <button
              onClick={() =>
                onAddtoCartHnadel(productData, selectedSize, selectedColor)
              }
              className="bg-[#f01b87] text-white px-8 py-3 text-sm active:bg-gray-700"
            >
              افزودن به سبد خرید
            </button>
            <hr className="mt-8 sm:w-4/5" />
            <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
              <p>100% محصول اورجینال</p>
              {/* <p>برای این محصول پرداخت در محل فعال می باشد</p>
              <p>بازگشت و تعویض محصول در 7 روز</p> */}
            </div>
          </div>
        </div>
        {/* description & riview sction */}
        <div className="mt-20">
          <div className="flex">
            <b className="border px-5 py-3 text-sm">توضیحات</b>
            {/* <p className="border px-5 py-3 text-sm">بازدیدکننده‌گان (122)</p> */}
          </div>
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
            <p className="text-lg">{productData.description}</p>
          </div>
        </div>
        {/* --------------Display Related Products------------------ */}
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
