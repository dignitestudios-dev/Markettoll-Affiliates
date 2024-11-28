import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import Loader from "../Global/Loader";

const CategoriesSidebar = ({ products }) => {
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
              to={`/categories/${l?.category}`}
              className={`w-full flex items-center justify-between ${
                index !== 12 && "border-b border-[#9D9D9DDD]"
              } py-3.5 ${l.category == "Electronics" && "blue-text"}`}
            >
              <span className="text-base font-medium">{l?.category}</span>
              <MdOutlineKeyboardArrowRight className="light-blue-text text-xl" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesSidebar;
