import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import ProductsItems from "../components/ProductsItems";
import CategoriesCart from "../components/CategoriesCart";
import Title from "../components/Title";
import Pagination from "../components/Pagination";

const SpecialProducts = () => {
  const { products, specialName, itemsPerPage } = useContext(ShopContext);

  const [specialProducts, setSpecialProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showProducts, setShowProducts] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  let specialQueryParamName = "";

  const fetchSpecialProducts = async () => {
    try {
      specialQueryParamName = searchParams.get("special");
      let copySpecialProducts = [];
      if (specialQueryParamName === "latest-product") {
        copySpecialProducts = products.slice(0, 20);
        copySpecialProducts = copySpecialProducts.filter(
          (item) => item.warehouseInventory > 0
        );
      } else if (specialQueryParamName === "special-product") {
        copySpecialProducts = products.slice();
        copySpecialProducts = copySpecialProducts.filter(
          (item) => item.bestSeller === true && item.warehouseInventory > 0
        );
      } else {
        return navigate("/");
      }
      setSpecialProducts(copySpecialProducts);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchSpecialProducts();
  }, []);

  const totalPages = Math.ceil(specialProducts.length / itemsPerPage);
  //Pagination
  useEffect(() => {
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    setShowProducts(
      specialProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    );
  }, [specialProducts, currentPage]);

  const navigate = useNavigate();

  if (specialName === "") {
    return navigate("/");
  }

  return (
    <div>
      <CategoriesCart />
      <div className="my-5">
        <div className="flex justify-center mt-10 mb-2 py-2 bg-[#b8e1d3]">
          <Title
            text1={specialName === "latest-product" ? "جدیدترین" : "فـــروش"}
            text2={specialName === "latest-product" ? "محصولات" : "ویـــژه"}
          />
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
    </div>
  );
};

export default SpecialProducts;
