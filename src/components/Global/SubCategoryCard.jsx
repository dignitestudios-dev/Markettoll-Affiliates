import React from "react";
import { useNavigate } from "react-router-dom";

const SubCategoryCard = () => {
  const navigate = useNavigate();
  const category = "consoles";

  const handleNavigate = () => {
    navigate(`/categories/${category}`, {
      state: { from: `/categories/${category}` },
    });
  };
  return (
    <div
      className="w-full rounded-[15px] custom-shadow p-3 cursor-pointer"
      onClick={handleNavigate}
    >
      <div className="w-full h-[276px]">
        <img
          src="/sub-category-img.png"
          alt="sub-category-img"
          className="w-full h-full rounded-[15px]"
        />
      </div>
      <h3 className="text-[18px] font-medium my-2">Mobile</h3>
    </div>
  );
};

export default SubCategoryCard;
