import React, { useContext, useEffect } from "react";
import { Link, useSearchParams, createSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const SubCategoriesCart = ({ catName, subCategoryName, src }) => {
  const { setSubCategoryName, setCategoryName } = useContext(ShopContext);

  const onClickHandler = () => {
    setSubCategoryName(subCategoryName);

    catName === "مردانه"
      ? setCategoryName("مردانه")
      : setCategoryName("بچگانه");
  };

  return (
    <Link
      to={{
        pathname: "/product",
        search: `?${createSearchParams({
          category: `${subCategoryName}`,
        })}`,
      }}
      onClick={onClickHandler}
      className="bg-gradient-to-r from-rose-100 to-teal-100 h-52 w-[95%] flex justify-around items-center rounded-lg m-3 cursor-pointer"
    >
      <div className="flex text-[#15224c] text-[15px]">
        <p className="ml-1">{subCategoryName}</p>
        <p>{catName}</p>
      </div>
      <img className="w-32" src={src} alt="" />
    </Link>
  );
};

export default SubCategoriesCart;
