import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import ProductsItems from "../components/ProductsItems";
import Title from "../components/Title";
import Pagination from "../components/Pagination";

const TypedProducts = () => {
  const { products, itemsPerPage } = useContext(ShopContext);

  const [typeProducts, setTypeProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showProducts, setShowProducts] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const fetchTypedProducts = async () => {
    try {
      const typeQueryParamName = searchParams.get("type");

      let copyTypeProducts = products.slice();

      copyTypeProducts = copyTypeProducts.filter(
        (item) => item.productType === typeQueryParamName
      );

      if (copyTypeProducts.length > 0) {
        setTypeProducts(copyTypeProducts);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchTypedProducts();
  }, []);

  const totalPages = Math.ceil(typeProducts.length / itemsPerPage);
  //Pagination
  useEffect(() => {
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    setShowProducts(
      typeProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    );
  }, [typeProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, []);

  const navigate = useNavigate();

  return (
    <div className="mb-10">
      <div className="mr-8 mt-2 flex gap-2 text-gray-500">
        {" "}
        {/*مسیر راه دسته بندی */}
        <Link to="/collection" className="hover:text-gray-700">
          محصـــــولات پوشکـــان
        </Link>{" "}
        /
        <p className="hover:text-gray-700 cursor-pointer">
          {searchParams.get("type")}
        </p>
      </div>
      <div className="flex justify-center mt-10 mb-2 py-2 bg-[#b8e1d3]">
        <Title text1={"دسته‌بندی"} text2={searchParams.get("type")} />
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

export default TypedProducts;
