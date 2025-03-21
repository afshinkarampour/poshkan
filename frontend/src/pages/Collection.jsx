import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { MdArrowDropDown } from "react-icons/md";
import Title from "../components/Title";
import ProductsItems from "../components/ProductsItems";
import CategoriesCart from "../components/CategoriesCart";
import Pagination from "../components/Pagination";

const Collection = () => {
  const { products, search, showSearch, itemsPerPage } =
    useContext(ShopContext);

  // const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  const [currentPage, setCurrentPage] = useState(1);
  const [showProducts, setShowProducts] = useState([]);

  // const toggleCategory = (e) => {
  //   if (category.includes(e.target.value)) {
  //     setCategory((prev) => prev.filter((item) => item !== e.target.value));
  //   } else {
  //     setCategory((prev) => [...prev, e.target.value]);
  //   }
  // };

  // const toggleSubCategory = (e) => {
  //   if (subCategory.includes(e.target.value)) {
  //     setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
  //   } else {
  //     setSubCategory((prev) => [...prev, e.target.value]);
  //   }
  // };

  const applyFilter = () => {
    let productCopy = products.slice();

    if (search) {
      productCopy = productCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productCopy = productCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productCopy = productCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productCopy);
  };

  const sortProducts = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;

      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        applyFilter();
        break;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, products]);

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  const totalPages = Math.ceil(filterProducts.length / itemsPerPage);
  //Pagination
  useEffect(() => {
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    setShowProducts(
      filterProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    );
  }, [filterProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortType, category, subCategory, search]);

  return (
    <div className="border-t mb-10">
      <CategoriesCart />
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10">
        {/* Filter options */}
        {/* <div className="min-w-40">
          <p
            onClick={() => setShowFilter(!showFilter)}
            className="my-2 text-xl flex items-center cursor-pointer gap-2"
          >
            فیلترها
            <div className={`h-3 sm:hidden ${showFilter ? "" : "-rotate-90"}`}>
              <MdArrowDropDown size={20} />
            </div>
          </p>
          // Catgory filter 
          <div
            className={`border border-gray-300 pr-5 pl-0 py-3 mt-6 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">دسته‌بندی اصلی</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className="flex gap-2">
                <input
                  className="w-2"
                  type="checkbox"
                  value={"مردانه"}
                  onChange={toggleCategory}
                />
                مردانه
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={"زنانه"}
                  onChange={toggleCategory}
                />
                زنانه
              </p>
              <p className="flex gap-2">
                <input
                  className="w-2"
                  type="checkbox"
                  value={"بچگانه"}
                  onChange={toggleCategory}
                />
                بچگانه
              </p>
            </div>
          </div>
          // Subcategory Filter
          <div
            className={`border border-gray-300 pr-5 py-3 my-5 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">نوع محصول</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className="flex gap-2">
                <input
                  className="w-2"
                  type="checkbox"
                  value={"شلوار"}
                  onChange={toggleSubCategory}
                />
                شلوار
              </p>
              <p className="flex gap-2">
                <input
                  className="w-2"
                  type="checkbox"
                  value={"پیراهن"}
                  onChange={toggleSubCategory}
                />
                پیراهن
              </p>
              <p className="flex gap-2">
                <input
                  className="w-2"
                  type="checkbox"
                  value={"تی‌شرت"}
                  onChange={toggleSubCategory}
                />
                تی‌شرت
              </p>
            </div>
          </div>
        </div> */}
        {/* Right side */}
        <div className="flex-1">
          <div className="flex justify-between text-base sm:text-2xl sm:px-5 mb-4 py-2 bg-[#b8e1d3]">
            <Title text1={"محصـــــولات"} text2={"پوشکان"} />
            {/* Product sort */}
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="border-2 border-gray-200 text-sm px-2 sm:px-6"
            >
              <option value="relavent">جدیدتــرین</option>
              <option value="low-high">ارزان‌تــرین</option>
              <option value="high-low">گران‌تــرین</option>
            </select>
          </div>
          {/* Map Products */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-4 gap-y-6">
            {showProducts.map((items, index) => (
              <ProductsItems
                key={index}
                id={items._id}
                image={items.img}
                name={items.name}
                price={items.price}
                discount={items.discount}
                warehouseInventory={items.warehouseInventory}
                bottomColor={"bg-[#b8e1d3]"}
              />
            ))}
          </div>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Collection;
