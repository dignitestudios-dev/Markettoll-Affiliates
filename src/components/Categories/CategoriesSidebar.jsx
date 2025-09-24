import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const CategoriesSidebar = ({
  products,
  handleCategoryTab,
  selectedCategory,
}) => {
  const { category } = useParams();
  console.log(category, products, "productss");
  return (
    <div className="">
      <Link to="/" className="flex items-center gap-1">
        <GoArrowLeft className="text-xl light-blue-text" />
        <span className="text-sm font-medium text-[#5C5C5C]">Back</span>
      </Link>
      <h3 className="blue-text text-[28px] font-bold my-3">Categories</h3>
      <div className="custom-shadow p-6 rounded-2xl">
        {products?.map((l, index) => {
          return (
            <Link
              key={index}
              // to={`/home/categories/${l?.name}`}
              onClick={() => {
                const formattedCategory = l?.name?.replace("&", "%26")
                handleCategoryTab(formattedCategory);
              }}
              className={`w-full flex items-center justify-between ${
                index !== 12 && "border-b border-[#9D9D9DDD]"
              } py-3.5 ${
                l.name == selectedCategory
                  ? "blue-text font-bold "
                  : "font-medium"
              }`}
            >
              <span className="text-base ">{l?.name}</span>
              <MdOutlineKeyboardArrowRight className="light-blue-text text-xl" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesSidebar;
