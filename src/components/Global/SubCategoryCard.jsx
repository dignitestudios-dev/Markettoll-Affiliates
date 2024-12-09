import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const SubCategoryCard = ({ subCategory }) => {
  const navigate = useNavigate();
  const { category } = useParams();

  const handleNavigate = () => {
    navigate(`/categories/${category}/${subCategory?.name}`, {
      state: { from: `/home/categories/${subCategory?.name}` },
    });
  };
  return (
    <div
      className="w-full lg:w-[290px] rounded-[15px] custom-shadow p-3 cursor-pointer"
      onClick={handleNavigate}
    >
      <div className="w-full h-[276px]">
        <img
          src={subCategory?.image}
          alt="sub-category-img"
          className="w-full h-full rounded-[15px] object-cover"
        />
      </div>
      <h3 className="text-[18px] font-medium my-2">{subCategory?.name}</h3>
    </div>
  );
};

export default SubCategoryCard;
