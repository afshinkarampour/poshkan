//کارتهای زیردسته در صفحه اصلی
import React from "react";
import SubCategoriesCart from "./SubCategoriesCart";
import Title from "./Title";
import { categories } from "../assets/assets";

const SubCategoriesCarts = () => {
  return (
    <div className="mx-5">
      <div className="flex mr-4">
        <Title text1={""} text2={"‌محبـــوب‌‌‌ترین‌ها"} />
      </div>
      {categories.map((cat, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        >
          {cat.subCategory.slice(0, 4).map((subCat, index) => (
            <SubCategoriesCart
              key={index}
              catName={cat.name}
              subCategoryName={subCat.name}
              src={subCat.src}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SubCategoriesCarts;
