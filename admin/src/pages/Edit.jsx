import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { assets, categories, productTypes } from "../assets/assets";
import axiosInstance from "../services/axiosInstance";

const Edit = () => {
  const { productId } = useParams();

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [productData, setProductData] = useState("");
  const [category, setCategory] = useState("مردانه");
  const [subCategory, setSubCategory] = useState("پیراهن");
  const [productType, setProductType] = useState("روزمره");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [warehouseInventory, setWarehouseInventory] = useState("");
  const [differentProduct, setDifferentProduct] = useState("");
  const [tempFeatures, setTempFeatures] = useState([
    { color: "", size: "", count: 0 },
  ]);
  const [features, setFeatures] = useState([{}]);
  const [userSizeGuid, setUserSizeGuid] = useState([{}]);
  const [tempUserSizeGuide, setTempUserSizeGuide] = useState([
    { size: "", comment: "" },
  ]);
  const [differentSizes, setDifferentSizes] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [isPublish, setPublish] = useState(true);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("discount", discount);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("productType", productType);
      formData.append("bestSeller", bestseller);
      formData.append("isPublish", isPublish);
      formData.append("features", JSON.stringify(features));
      formData.append("warehouseInventory", warehouseInventory);
      formData.append("userSizeGuide", JSON.stringify(userSizeGuid));
      formData.append("productId", productId);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      // formData log for debugging
      for (var pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      const response = await axiosInstance.post(
        backendUrl + "/api/product/update",
        formData
      );

      if (response.data.success) {
        toast.success("بروزرسانی با موفیت انجام شد");
        window.location.href = "/list";
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleDifferentProductChange = (value) => {
    const newCount = parseInt(value, 10) > 0 ? parseInt(value, 10) : 0;
    // گسترش یا کاهش tempFeatures بر اساس تعداد جدید
    setTempFeatures((prevFeatures) => {
      const updatedFeatures = [...prevFeatures];
      if (newCount > prevFeatures.length) {
        // افزودن آیتم‌های جدید با مقادیر پیش‌فرض
        for (let i = prevFeatures.length; i < newCount; i++) {
          updatedFeatures.push({ color: "", size: "", count: 0 });
        }
      } else if (newCount < prevFeatures.length) {
        // کاهش تعداد آیتم‌ها
        updatedFeatures.splice(newCount);
      }
      return updatedFeatures;
    });
    setDifferentProduct(newCount);
  };

  const handleDifferentSizeChange = (value) => {
    const newCount = parseInt(value, 10) > 0 ? parseInt(value, 10) : 0;
    // گسترش یا کاهش tempFeatures بر اساس تعداد جدید
    setTempUserSizeGuide((prevSize) => {
      const updatedSize = [...prevSize];
      if (newCount > prevSize.length) {
        // افزودن آیتم‌های جدید با مقادیر پیش‌فرض
        for (let i = prevSize.length; i < newCount; i++) {
          updatedSize.push({ color: "", size: "", count: 0 });
        }
      } else if (newCount < prevSize.length) {
        // کاهش تعداد آیتم‌ها
        updatedSize.splice(newCount);
      }
      return updatedSize;
    });
    setDifferentSizes(newCount);
  };

  const handleColorFeatureChange = (value, featureIndex) => {
    // update only color of tempFeature State
    setTempFeatures(
      tempFeatures.map((feature, index) =>
        index === featureIndex ? { ...feature, color: value } : feature
      )
    );
  };

  const handleSizeFeatureChange = (value, featureIndex) => {
    setTempFeatures(
      tempFeatures.map((feature, index) =>
        index === featureIndex ? { ...feature, size: value } : feature
      )
    );
  };

  const handleCountFeatureChange = (value, featureIndex) => {
    const count = parseInt(value);
    setTempFeatures(
      tempFeatures.map((feature, index) =>
        index === featureIndex ? { ...feature, count: count } : feature
      )
    );
  };

  const featuresInput = [];
  // ایجاد فرم بر اساس تعداد محصولات متفاوت(از نظر رنگ و سایز)
  for (let i = 0; i < differentProduct; i++) {
    featuresInput.push(
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="flex flex-col">
          رنگ{" "}
          <input
            required
            className="py-2 pr-2 w-[140px]"
            value={tempFeatures[i].color}
            name={"color" + i}
            onChange={(e) => handleColorFeatureChange(e.target.value, i)}
            type="text"
          ></input>
        </div>
        <div className="flex flex-col">
          سایز{" "}
          <input
            required
            className="py-2 pr-2 w-[140px]"
            value={
              tempFeatures[i].size ? tempFeatures[i].size : tempFeatures.size
            }
            name={"size" + i}
            onChange={(e) => handleSizeFeatureChange(e.target.value, i)}
            type="text"
          ></input>
        </div>
        <div className="flex flex-col">
          تعداد{" "}
          <input
            required
            className="py-2 pr-2 w-[140px]"
            value={
              tempFeatures[i].count ? tempFeatures[i].count : tempFeatures.count
            }
            name={"count" + i}
            onChange={(e) => handleCountFeatureChange(e.target.value, i)}
            type="number"
          ></input>
        </div>
      </div>
    );
  }

  const handleSizeUserGuidChange = (value, userGuidIndex) => {
    setTempUserSizeGuide(
      tempUserSizeGuide.map((userSize, index) =>
        index === userGuidIndex ? { ...userSize, size: value } : userSize
      )
    );
  };

  const handleCommentUserGuidChange = (value, userGuidIndex) => {
    setTempUserSizeGuide(
      tempUserSizeGuide.map((userSize, index) =>
        index === userGuidIndex ? { ...userSize, comment: value } : userSize
      )
    );
  };

  const userSizeInputs = [];
  //ایجاد فرم جهت راهنمای انتخاب سایز
  for (let i = 0; i < differentSizes; i++) {
    userSizeInputs.push(
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex flex-col">
          سایز{" "}
          <input
            required
            className="w-[170px] py-2 pr-2"
            value={tempUserSizeGuide[i].size}
            name={"size" + i}
            onChange={(e) => handleSizeUserGuidChange(e.target.value, i)}
            type="text"
          ></input>
        </div>
        <div className="flex flex-col">
          توضیحات{" "}
          <textarea
            required
            className="w-[250px] p-2 h-44"
            value={tempUserSizeGuide[i].comment}
            name={"comment" + i}
            onChange={(e) => handleCommentUserGuidChange(e.target.value, i)}
            type="text"
          ></textarea>
        </div>
      </div>
    );
  }

  const urlToFile = async (url, filename) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const fillData = async () => {
    if (productData.img[0]) {
      const file = await urlToFile(
        `${backendUrl}/uploads/${productData.img[0]}`,
        productData.img[0]
      );
      setImage1(file);
    } else {
      setImage1("");
    }
    // setImage1(productData.img[0] ? productData.img[0] : "");
    setImage2(productData.img[1] ? productData.img[1] : "");
    setImage3(productData.img[2] ? productData.img[2] : "");
    setImage4(productData.img[3] ? productData.img[3] : "");
    setName(productData.name);
    setDescription(productData.description);
    setPrice(productData.price);
    setDiscount(productData.discount ? productData.discount : "");
    setDifferentProduct(productData.features ? productData.features.length : 0);
    setFeatures(productData.features ? productData.features : "");
    setTempFeatures(productData.features);
    setDifferentSizes(
      productData.userSizeGuide ? productData.userSizeGuide.length : 0
    );
    setTempUserSizeGuide(
      productData.userSizeGuide ? productData.userSizeGuide : ""
    );
    setUserSizeGuid(productData.userSizeGuide ? productData.userSizeGuide : "");
    setBestseller(productData.bestSeller);
    setPublish(productData.isPublish);
  };

  const fetchProduct = async () => {
    try {
      const response = await axiosInstance.post(
        `${backendUrl}/api/product/single`,
        { productId }
      );
      if (response.data.success) {
        setProductData(response.data.product);
      } else {
        toast.error("محصول مورد نظر پیدا نشد!");
      }
    } catch (error) {
      toast.error("خطا در بارگذاری اطلاعات محصول!");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    if (productData) fillData();
  }, [productData]);

  useEffect(() => {
    let totalCount = 0;

    for (let i = 0; i < differentProduct; i++) {
      if (parseInt(tempFeatures[i].count)) {
        totalCount += parseInt(tempFeatures[i].count);
        setWarehouseInventory(parseInt(totalCount));
      }
    }

    let x = []; //features array
    for (let i = 0; i < differentProduct; i++) {
      let y = {}; //property object
      y[`color`] = tempFeatures[i].color;
      y[`size`] = tempFeatures[i].size;
      y[`count`] = parseInt(tempFeatures[i].count);
      x.push(y);
    }
    setFeatures(x);
  }, [tempFeatures, differentProduct]);

  useEffect(() => {
    let x = []; //userSizeGuid array
    for (let i = 0; i < differentSizes; i++) {
      let y = {}; //property object
      y[`size`] = tempUserSizeGuide[i].size;
      y[`comment`] = tempUserSizeGuide[i].comment;
      x.push(y);
    }
    setUserSizeGuid(x);
  }, [tempUserSizeGuide, differentSizes]);

  return (
    <div>
      <form onSubmit={onSubmitHandler} className="flex flex-col gap-2 w-full">
        <div className="">
          <p className="mb-2 ">آپلود تصاویر محصول</p>
          <div className="flex gap-2">
            <label>
              <img
                className="w-20 cursor-pointer"
                src={
                  !image1
                    ? assets.uploadImage
                    : typeof image1 === "string"
                    ? `${backendUrl}/uploads/${image1}`
                    : URL.createObjectURL(image1)
                }
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
                src={
                  !image2
                    ? assets.uploadImage
                    : typeof image2 === "string"
                    ? `${backendUrl}/uploads/${image2}`
                    : URL.createObjectURL(image2)
                }
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
                src={
                  !image3
                    ? assets.uploadImage
                    : typeof image3 === "string"
                    ? `${backendUrl}/uploads/${image3}`
                    : URL.createObjectURL(image3)
                }
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
                src={
                  !image4
                    ? assets.uploadImage
                    : typeof image4 === "string"
                    ? `${backendUrl}/uploads/${image4}`
                    : URL.createObjectURL(image4)
                }
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
        <div className="flex flex-col">
          <div className="">
            <p className="mb-1">نام محصول</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-[300px] sm:w-[500px] px-3 py-2"
              type="text"
              required
            />
          </div>

          <div className="mt-2">
            <p className="mb-1">شرح</p>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="w-[300px] sm:w-[500px] px-3 py-2"
              type="text"
              required
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:gap-5">
          <div>
            <p className="mb-1">دسته‌بندی</p>
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="w-[230px] pr-1 py-2"
            >
              {categories.map((item) => (
                <option
                  key={item.id}
                  value={item.name}
                  selected={
                    item.name === productData.category ? "true" : "false"
                  }
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-2 sm:mt-0">
            <p className="mb-1">زیر دسته</p>
            <select
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-[230px] pr-1 py-2"
            >
              {categories
                .filter((item) => item.name === category)[0]
                .subCategory.map((item) => (
                  <option
                    key={item.id}
                    value={item.name}
                    selected={
                      item.name === productData.subCategory ? "true" : "false"
                    }
                  >
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="mt-2 sm:mt-0">
            <p className="mb-1">نوع محصول</p>
            <select
              onChange={(e) => setProductType(e.target.value)}
              className="w-[230px] pr-1 py-2"
            >
              {productTypes.map((item) => (
                <option
                  key={item.id}
                  value={item.name}
                  selected={
                    item.name === productData.productType ? "true" : "false"
                  }
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 mt-2">
          <div>
            <p className="mb-1">قیمت محصول</p>
            <div className="flex gap-1 items-center">
              <input
                onChange={(e) =>
                  setPrice(e.target.value > 0 ? e.target.value : 0)
                }
                value={price}
                className="pr-1 py-1 w-[190px]"
                type="text"
                required
              />
              تومان
            </div>
          </div>

          <div>
            <p className="mb-1">قیمت با تخفیف</p>
            <div className="flex gap-1 items-center">
              <input
                onChange={(e) =>
                  setDiscount(e.target.value > 0 ? e.target.value : 0)
                }
                value={discount}
                className="pr-1 py-1 w-[190px]"
                type="number"
              />
              تومان
            </div>
          </div>
        </div>
        <div>
          <p className="mb-1">تعداد محصول متفاوت</p>
          <input
            onChange={(e) => handleDifferentProductChange(e.target.value)}
            value={differentProduct}
            className="pr-2 py-1 w-[189px]"
            type="number"
          />
        </div>
        <div className="py-5 px-1 border rounded-lg">{featuresInput}</div>
        <div>
          <p className="mb-1">تعداد سایز متفاوت</p>
          <input
            onChange={(e) => handleDifferentSizeChange(e.target.value)}
            value={differentSizes}
            className="pr-2 py-1 w-[189px]"
            type="number"
          />
        </div>
        <div className="py-5 px-1 border rounded-lg">{userSizeInputs}</div>
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
        <div className="flex flex-col justify-around">
          <button
            className="py-3 rounded-lg mt-4 bg-[#15224c] text-white font-semibold"
            type="submit"
          >
            ویرایش محصول
          </button>
          <button
            className="py-3 rounded-lg mt-4 bg-[#15224c] text-white font-semibold"
            type="cancel"
            onClick={() => (window.location.href = "/list")}
          >
            بازگشت به محصولات
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit;
