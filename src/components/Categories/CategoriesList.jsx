import React from "react";
import SubCategoryCard from "../Global/SubCategoryCard";

const CategoriesList = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-20">
      <SubCategoryCard />
      <SubCategoryCard />
      <SubCategoryCard />
      <SubCategoryCard />
      <SubCategoryCard />
      <SubCategoryCard />
    </div>
  );
};

export default CategoriesList;
