import React, { useEffect, useState, useContext } from "react";
import {
  useSearchParams,
  createSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { categories } from "../assets/assets";
import ProductsItems from "../components/ProductsItems";
import Title from "../components/Title";
import Pagination from "../components/Pagination";

const CategorizedProducts = () => {
  const {
    products,
    categoryName,
    itemsPerPage,
    subCategoryName,
    setSubCategoryName,
  } = useContext(ShopContext);

  const [catProducts, setCatProducts] = useState([]);
  const [subCategoryProducts, setSubCategoryProducts] = useState([]); //ذخیره نام دسته و زیردسته‌های آن
  const [currentPage, setCurrentPage] = useState(1);
  const [showProducts, setShowProducts] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const fetchCategorizedProducts = async () => {
    try {
      const categoryQueryParamName = searchParams.get("category");

      let copyCategoryProducts = products.slice();

      copyCategoryProducts = copyCategoryProducts.filter(
        (item) => item.category === categoryQueryParamName
      );

      if (copyCategoryProducts.length > 0) {
        setCatProducts(copyCategoryProducts);
        //نمایش زیردسته ها
        let copyCategories = categories.slice();
        copyCategories = copyCategories.filter(
          (item) => item.name === categoryQueryParamName
        );
        setSubCategoryProducts(copyCategories);
      } else {
        let copySubCategoryProducts = products.slice();
        copySubCategoryProducts = copySubCategoryProducts.filter(
          (item) => item.category === categoryName
        );
        const subCategoryProducts = copySubCategoryProducts.filter(
          (item) => item.subCategory === categoryQueryParamName
        );

        setCatProducts(subCategoryProducts);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchCategorizedProducts();
  }, [subCategoryName, categoryName, searchParams]);

  const totalPages = Math.ceil(catProducts.length / itemsPerPage);
  //Pagination
  useEffect(() => {
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    setShowProducts(catProducts.slice(indexOfFirstProduct, indexOfLastProduct));
  }, [catProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [subCategoryName]);

  const navigate = useNavigate();

  if (categoryName === "") {
    return navigate("/");
  }

  return (
    <div className="mb-10">
      <div className="mr-8 mt-2 flex gap-2 text-gray-500">
        {" "}
        {/*مسیر راه دسته بندی */}
        <Link to="/collection" className="hover:text-gray-700">
          محصـــــولات پوشکـــان
        </Link>{" "}
        /
        <Link
          to={{
            pathname: "/product",
            search: `?${createSearchParams({
              category: `${categoryName}`,
            })}`,
          }}
          onClick={() => setSubCategoryName("")}
          className="hover:text-gray-700 cursor-pointer"
        >
          {categoryName}
        </Link>
        <p style={{ display: subCategoryName !== "" ? "block" : "none" }}>/</p>
        <p className="hover:text-gray-700 cursor-pointer">{subCategoryName}</p>
      </div>
      <div>
        {subCategoryProducts.map((subCategory) => (
          //جهت نمایش زیردسته ها بصورت دایره
          <div
            className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            key={subCategory.id}
          >
            {subCategory.subCategory.map((item) => (
              <Link
                to={{
                  pathname: "/product",
                  search: `?${createSearchParams({
                    category: `${item.name}`,
                  })}`,
                }}
                key={item.id}
                onClick={() => setSubCategoryName(item.name)}
              >
                <div className="flex flex-col gap-0 items-center justify-center cursor-pointer">
                  <div className="w-[100px] h-[100px] p-2 border-2 border-slate-200 bg-slate-100 rounded-full my-3 ">
                    <img
                      src={item.src}
                      alt={item.name}
                      className="h-[100%] w-[100%] text-[#15224c]"
                    />
                  </div>
                  <p className="text-sm">{item.name}</p>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-10 mb-2 py-2 bg-[#b8e1d3]">
        <Title text1={"دسته‌بندی"} text2={searchParams.get("category")} />
      </div>
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
  );
};

export default CategorizedProducts;
