import React, { useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";
import { assets, categories, productTypes } from "../assets/assets";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import {
  formatAndConvertToPersianNumber,
  converToSimpleEnglishNumber,
} from "../services/formatNumber";

const Add = () => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("مردانه");
  const [subCategory, setSubCategory] = useState("پیراهن");
  const [productType, setProductType] = useState("روزمره");
  const [bestseller, setBestseller] = useState(false);
  const [tempFeatures, setTempFeatures] = useState([{}]);
  const [features, setFeatures] = useState([{}]);
  const [warehouseInventory, setWarehouseInventory] = useState("");
  const [weight, setWeight] = useState("");
  const [differentProduct, setDifferentProduct] = useState("");
  const [discount, setDiscount] = useState("");
  const [userSizeGuid, setUserSizeGuid] = useState([{}]);
  const [tempUserSizeGuide, setTempUserSizeGuide] = useState([{}]);
  const [differentSizes, setDifferentSizes] = useState("");
  const [isPublish, setPublish] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSubmitHandeler = async (e) => {
    e.preventDefault();
    const savedPrice = converToSimpleEnglishNumber(price);

    const savedDiscount = converToSimpleEnglishNumber(discount);

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", Number(savedPrice));
      formData.append("discount", Number(savedDiscount));
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("productType", productType);
      formData.append("bestSeller", bestseller);
      formData.append("isPublish", isPublish);
      formData.append("features", JSON.stringify(features));
      formData.append("warehouseInventory", warehouseInventory);
      formData.append("weight", weight);
      formData.append("userSizeGuide", JSON.stringify(userSizeGuid));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      // formData log for debugging
      for (var pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      const response = await axiosInstance.post(
        backendUrl + "/api/product/add",
        formData
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setDiscount("");
        setDifferentProduct("");
        setUserSizeGuid("");
        setBestseller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      console.log(response);
      toast.error(response?.data?.message || "خطای نامشخصی رخ داده است");
    } finally {
      setLoading(false);
    }
  };

  const featuresInput = [];
  let totalCount = 0;

  //ایجاد فرم بر اساس تعداد محصولات متفاوت(از نظر رنگ و سایز)
  for (let i = 0; i < differentProduct; i++) {
    featuresInput.push(
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="flex flex-col">
          رنگ{" "}
          <input
            required
            className="py-2"
            value={tempFeatures.color}
            name={"color" + i}
            onChange={(e) =>
              setTempFeatures((data) => ({
                ...data,
                [e.target.name]: e.target.value,
              }))
            }
            type="text"
          ></input>
        </div>
        <div className="flex flex-col">
          سایز{" "}
          <input
            required
            className="py-2"
            value={tempFeatures.size}
            name={"size" + i}
            onChange={(e) =>
              setTempFeatures((data) => ({
                ...data,
                [e.target.name]: e.target.value,
              }))
            }
            type="text"
          ></input>
        </div>
        <div className="flex flex-col">
          تعداد{" "}
          <input
            required
            className="py-2"
            value={tempFeatures.count}
            name={"count" + i}
            onChange={(e) => {
              setTempFeatures((data) => ({
                ...data,
                [e.target.name]: e.target.value > 0 ? e.target.value : 0,
              }));
            }}
            type="number"
          ></input>
        </div>
      </div>
    );
  }

  const userSizeInputs = [];

  //ایجاد فرم جهت راهنمای انتخاب سایز
  for (let i = 0; i < differentSizes; i++) {
    userSizeInputs.push(
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex flex-col">
          سایز{" "}
          <input
            required
            className="py-2"
            value={tempUserSizeGuide.size}
            name={"size" + i}
            onChange={(e) =>
              setTempUserSizeGuide((data) => ({
                ...data,
                [e.target.name]: e.target.value,
              }))
            }
            type="text"
          ></input>
        </div>
        <div className="flex flex-col">
          توضیحات{" "}
          <textarea
            required
            className="w-96 h-44"
            value={tempUserSizeGuide.comment}
            name={"comment" + i}
            onChange={(e) =>
              setTempUserSizeGuide((data) => ({
                ...data,
                [e.target.name]: e.target.value,
              }))
            }
            type="text"
          ></textarea>
        </div>
      </div>
    );
  }

  useEffect(() => {
    for (let i = 0; i < differentProduct; i++) {
      if (parseInt(tempFeatures[`count${i}`])) {
        totalCount += parseInt(tempFeatures[`count${i}`]);
        setWarehouseInventory(totalCount);
      }
    }
    let x = []; //features array
    for (let i = 0; i < differentProduct; i++) {
      let y = {}; //property object
      y[`color`] = tempFeatures[`color${i}`];
      y[`size`] = tempFeatures[`size${i}`];
      y[`count`] = parseInt(tempFeatures[`count${i}`]);
      x.push(y);
    }
    setFeatures(x);
  }, [tempFeatures]);

  useEffect(() => {
    let x = []; //userSizeGuid array
    for (let i = 0; i < differentSizes; i++) {
      let y = {}; //property object
      y[`size`] = tempUserSizeGuide[`size${i}`];
      y[`comment`] = tempUserSizeGuide[`comment${i}`];
      x.push(y);
    }
    setUserSizeGuid(x);
  }, [tempUserSizeGuide]);

  const handlePriceChange = (e) => {
    const rawValue = e.target.value ? e.target.value : 0;
    const formatted = formatAndConvertToPersianNumber(rawValue);
    setPrice(formatted);
  };

  const handleDiscountChange = (e) => {
    const rawValue = e.target.value ? e.target.value : 0;
    const formatted = formatAndConvertToPersianNumber(rawValue);
    setDiscount(formatted);
  };

  return (
    <form
      onSubmit={onSubmitHandeler}
      className="flex flex-col w-full items-start gap-3"
    >
      <div className="">
        <p className="mb-2 ">آپلود تصاویر محصول</p>
        <div className="flex gap-2">
          <label>
            <img
              className="w-20 cursor-pointer"
              src={!image1 ? assets.uploadImage : URL.createObjectURL(image1)}
              alt=""
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>
          <label>
            <img
              className="w-20 cursor-pointer"
              src={!image2 ? assets.uploadImage : URL.createObjectURL(image2)}
              alt=""
            />
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              hidden
            />
          </label>
          <label>
            <img
              className="w-20 cursor-pointer"
              src={!image3 ? assets.uploadImage : URL.createObjectURL(image3)}
              alt=""
            />
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              hidden
            />
          </label>
          <label>
            <img
              className="w-20 cursor-pointer"
              src={!image4 ? assets.uploadImage : URL.createObjectURL(image4)}
              alt=""
            />
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              hidden
            />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">نام محصول</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">شرح</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Write content here"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-14">
        <div>
          <p className="mb-2">دسته‌بندی</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="pl-14 py-2"
          >
            {categories.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">زیر دسته</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className="py-2"
          >
            {categories
              .filter((item) => item.name === category)[0]
              .subCategory.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <p className="mb-2">نوع محصول</p>
          <select
            onChange={(e) => setProductType(e.target.value)}
            className="py-2 pl-10"
          >
            {productTypes.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">وزن محصول</p>
          <div className="flex gap-1 items-center">
            <input
              onChange={(e) => setWeight(e.target.value)}
              value={weight}
              className="w-full px-3 py-2 sm:w-[120px]"
              type="text"
              placeholder="1000"
              required
            />
            گرم
          </div>
        </div>

        <div>
          <p className="mb-2">قیمت محصول</p>
          <div className="flex gap-1 items-center">
            <input
              onChange={handlePriceChange}
              value={price}
              className="w-full px-3 py-2 sm:w-[120px]"
              type="text"
              placeholder="500000"
              required
            />
            تومان
          </div>
        </div>

        <div>
          <p className="mb-2">قیمت با تخفیف</p>
          <div className="flex gap-1 items-center">
            <input
              onChange={handleDiscountChange}
              value={discount}
              className="w-full px-3 py-2 sm:w-[120px]"
              type="text"
              placeholder="400000"
            />
            تومان
          </div>
        </div>
      </div>

      <div className="flex gap-12">
        <div>
          <p className="mb-2">تعداد محصول متفاوت</p>
          <input
            onChange={(e) => setDifferentProduct(e.target.value)}
            value={
              differentProduct > 0 && differentProduct <= 30
                ? differentProduct
                : ""
            }
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="5"
            required
          />
        </div>
      </div>
      {featuresInput}
      <div>
        <p className="mb-2">تعداد سایز متفاوت</p>
        <input
          onChange={(e) => setDifferentSizes(e.target.value)}
          value={
            differentSizes > 0 && differentSizes <= 30 ? differentSizes : ""
          }
          className="w-full px-3 py-2 sm:w-[120px]"
          type="number"
          placeholder="5"
          required
        />
      </div>
      {userSizeInputs}
      <div className="flex gap-2 mb-2">
        <input
          onChange={() => setBestseller(!bestseller)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          نمایش در لیست فروش ویژه
        </label>
      </div>
      <div className="flex gap-2 mb-2">
        <input
          onChange={() => setPublish(!isPublish)}
          checked={isPublish}
          type="checkbox"
          id="publish"
        />
        <label className="cursor-pointer" htmlFor="publish">
          نمایش در فروشگاه
        </label>
      </div>
      <button
        className="px-5 py-3 rounded-lg mt-4 bg-[#15224c] text-white font-semibold disabled:opacity-50"
        disabled={loading}
        type="submit"
      >
        {!loading ? "ثبت محصول" : "در حال ذخیره محصول"}
      </button>
    </form>
  );
};

export default Add;
