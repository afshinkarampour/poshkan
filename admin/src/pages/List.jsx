import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets, categories } from "../assets/assets";
import { IoMdCheckboxOutline, IoMdCloseCircleOutline } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { BiEditAlt } from "react-icons/bi";
import { LuSearch } from "react-icons/lu";
import Pagination from "../components/Pagination";
import axiosInstance from "../services/axiosInstance";

const List = () => {
  const [list, setList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState([]);
  const [search, setSearch] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [showProducts, setShowProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [exist, setExist] = useState(true);
  const [notExist, setNotExist] = useState(true);
  const [bestSeller, setBestSeller] = useState(true);
  const [isPublish, setIsPublish] = useState(true);

  useEffect(() => {
    if (selectedCategory && selectedCategory !== "all") {
      const category = categories?.find(
        (item) => item.name === selectedCategory
      );

      setSubCategories(category?.subCategory || []);
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory, categories]);

  const fetchList = async () => {
    try {
      const response = await axiosInstance.get(
        backendUrl + "/api/product/list"
      );
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const applyFilter = () => {
    let copyList = list.slice();
    if (search) {
      copyList = copyList.filter((item) =>
        item?.name?.toLowerCase()?.includes(search.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== "all") {
      copyList = copyList.filter((p) =>
        p?.category?.includes(selectedCategory)
      );
    }

    if (selectedSubCategory && selectedSubCategory !== "full") {
      copyList = copyList.filter((p) =>
        p?.subCategory?.includes(selectedSubCategory)
      );
    }

    if (!exist) {
      copyList = copyList.filter((p) => p.warehouseInventory === 0);
    }

    if (!notExist) {
      copyList = copyList.filter((p) => p.warehouseInventory > 0);
    }

    if (!bestSeller) {
      copyList = copyList.filter((p) => p.bestSeller === false);
    }

    if (!isPublish) {
      copyList = copyList.filter((p) => p.isPublish === false);
    }
    setFilteredList(copyList);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const removeProduct = async (id) => {
    const userConfirmed = window.confirm("آیا از حذف این محصول مطمئن هستید؟");

    if (!userConfirmed) {
      return; // اگر کاربر تأیید نکرد، هیچ کاری انجام نمی‌شود
    }
    try {
      const response = await axiosInstance.post(
        backendUrl + "/api/product/remove",
        { id }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  function convertToPersianDigits(input) {
    if (!input) return null;
    // Convert the input to a string to ensure replace works
    const inputStr = input.toString();
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return inputStr.replace(/\d/g, (digit) => persianDigits[digit]);
  }

  function formatAmount(amount) {
    // Check if the input is a valid number
    if (typeof amount !== "number" && typeof amount !== "string") {
      console.error(
        "Invalid input type. Input must be a number or a numeric string."
      );
      return "Invalid input";
    }
    // Convert input to a string
    const amountStr = amount.toString();
    // Validate if it's a numeric string
    if (!/^\d+$/.test(amountStr)) {
      console.error(
        "Input contains invalid characters. Only numbers are allowed."
      );
      return "Invalid input";
    }
    // Use regex to format with commas
    return amountStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  //Pagination
  useEffect(() => {
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    setShowProducts(
      filteredList.slice(indexOfFirstProduct, indexOfLastProduct)
    );
  }, [filteredList, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategory,
    selectedSubCategory,
    search,
    exist,
    notExist,
    bestSeller,
    isPublish,
  ]);

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [
    list,
    selectedCategory,
    selectedSubCategory,
    search,
    exist,
    notExist,
    bestSeller,
    isPublish,
  ]);

  return (
    <>
      <p className="mb-2 text-center"> محصولات پوشکان</p>
      <div className="flex flex-col gap-2">
        <div className="text-xs border shadow-md p-1">
          <p className="font-bold">جستجوی پیشرفته</p>
          <div className="flex flex-col md:flex-row md:justify-around">
            <div className="flex gap-2 items-center my-2">
              <p>جستجو</p>
              <div className="flex justify-between gap-2 px-2 py-1 bg-yellow-200 border border-gray-300 rounded-md w-full">
                <input
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  className="bg-yellow-200 border-none outline-none"
                  type="text"
                />
                <LuSearch className="-scale-x-100 scale-y-100" size={15} />
              </div>
            </div>
            <div className="flex sm:flex-col lg:flex-row gap-2 items-center mb-2">
              <p>دسته‌بندی</p>
              <select
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubCategory("full");
                }}
                name="category"
                className="w-full md:w-32 lg:w-48 py-1 bg-yellow-200"
              >
                <option value="all">همه‌ دسته‌ها</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex sm:flex-col lg:flex-row gap-2 items-center mb-2">
              <p>زیردسته‌بندی</p>
              <select
                name="subCategory"
                className="w-full md:w-32 lg:w-48 py-1 bg-yellow-200"
                onChange={(e) => setSelectedSubCategory(e.target.value)}
              >
                <option value="full">----</option>
                {subCategories.map((sub, index) => (
                  <option key={index} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-around sm:my-2">
            <div
              onClick={() => setExist(!exist)}
              className="flex gap-1 items-center cursor-pointer"
            >
              <input type="checkbox" value="exist" checked={exist} />
              <p>محصولات موجود</p>
            </div>
            <div
              onClick={() => setNotExist(!notExist)}
              className="flex gap-1 items-center cursor-pointer"
            >
              <input type="checkbox" value="notExist" checked={notExist} />
              <p>محصولات ناموجود</p>
            </div>
            <div
              onClick={() => setBestSeller(!bestSeller)}
              className="flex gap-1 items-center cursor-pointer"
            >
              <input type="checkbox" value="bestSeller" checked={bestSeller} />
              <p>فروش ویژه</p>
            </div>
            <div
              onClick={() => setIsPublish(!isPublish)}
              className="flex gap-1 items-center cursor-pointer"
            >
              <input type="checkbox" value="isPublish" checked={isPublish} />
              <p>نمایش در سایت</p>
            </div>
          </div>
        </div>
        {/* --------------Product list -------------------- */}
        {showProducts.map((item, index) => (
          <div
            className="p-1 border text-sm bg-[#fff4f6] shadow-md"
            key={index}
          >
            <p className="font-bold text-center mb-2">
              {convertToPersianDigits(item.name)}
            </p>
            {item.warehouseInventory <= 0 ? (
              <p className="text-center text-red-500 mb-2">اتمام موجودی</p>
            ) : (
              ""
            )}
            <div className="flex flex-col md:grid md:grid-cols-[3fr_1fr_1fr_1fr_1fr] md:items-center">
              <div className="flex items-center">
                <div className="pl-1">
                  <img
                    className="w-24 md:w-40"
                    src={
                      item?.img?.[0]
                        ? `${backendUrl}/uploads/${item.img[0]}`
                        : assets.noImage
                      // assets.product1 ||
                      // item.img[0].substring(0, item.img[0].indexOf("?"))
                    }
                    alt=""
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex gap-2">
                    <p className="">کل موجودی:</p>{" "}
                    <p className="text-center">
                      {convertToPersianDigits(item.warehouseInventory)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <p className="">وزن:</p>{" "}
                    <p className="text-center">
                      {convertToPersianDigits(item.weight)} گرم
                    </p>
                  </div>
                  <div className="">
                    <p className="">رنگ‌ها و سایزهای موجود:</p>{" "}
                    <p className="text-center">
                      {item.features.map((item, index) => (
                        <p key={index} className="flex gap-2 mr-1">
                          <p>{item.color}</p> /{" "}
                          <p>{convertToPersianDigits(item.size)}</p> /{" "}
                          <p>{convertToPersianDigits(item.count)}</p>
                        </p>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-center my-2">
                تاریخ ثبت: {convertToPersianDigits(item.date)}
              </p>
              <div className="flex flex-row md:flex-col justify-between md:justify-center mb-3 px-3">
                <p>{item.category}</p>
                <p>{item.subCategory}</p>
              </div>
              <div className="flex flex-row md:flex-col justify-between md:justify-center mb-3 px-3">
                <div className="flex gap-1">
                  <p>{convertToPersianDigits(formatAmount(item.price))}</p>
                  <p>{currency}</p>
                </div>
                {item.discount ? (
                  <div className="flex gap-1 text-red-600">
                    <p>{convertToPersianDigits(formatAmount(item.discount))}</p>
                    <p>{currency}</p>
                  </div>
                ) : (
                  "بدون تخفیف"
                )}
              </div>

              <div className="flex flex-row justify-center gap-5 md:gap-2 cursor-pointer">
                <p
                  onClick={() => removeProduct(item._id)}
                  className="text-center md:text-center text-lg text-gray-500 hover:text-gray-700"
                >
                  <RiDeleteBinLine size={20} />
                </p>
                <Link
                  to={`/product/${item._id}`}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <BiEditAlt size={20} />
                </Link>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-10">
              <div>
                <p className="flex gap-1">
                  {item.isPublish ? (
                    <IoMdCheckboxOutline size={20} color="green" />
                  ) : (
                    <IoMdCloseCircleOutline
                      size={20}
                      className="text-red-600"
                    />
                  )}
                  نمایش در سایت
                </p>
              </div>
              <div>
                <p className="flex gap-1">
                  {item.bestSeller ? (
                    <IoMdCheckboxOutline size={20} color="green" />
                  ) : (
                    <IoMdCloseCircleOutline
                      size={20}
                      className="text-red-600"
                    />
                  )}
                  جزء فروش ویژه
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default List;
