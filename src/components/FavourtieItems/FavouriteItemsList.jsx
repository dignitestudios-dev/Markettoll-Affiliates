import React, { useState } from "react";
import ProductCard from "../Global/ProductCard";

const FavouriteItemsList = () => {
  const [showServices, setShowServices] = useState(false);

  const handleShowServices = (category) => {
    if (category == "services") {
      setShowServices(true);
    } else {
      setShowServices(false);
    }
  };
  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-[28px] font-bold blue-text">
          {showServices ? "Favorite Services" : "Favorite Products"}
        </h2>
        <div className="hidden lg:flex items-center justify-end">
          <button
            type="button"
            onClick={() => handleShowServices("products")}
            className={`py-3 ${
              showServices ? "bg-[#F7F7F7] text-black" : "blue-bg text-white"
            } text-base font-bold px-5 rounded-l-2xl`}
          >
            Products
          </button>
          <button
            type="button"
            onClick={() => handleShowServices("services")}
            className={`py-3 ${
              !showServices ? "bg-[#F7F7F7] text-black" : "blue-bg text-white"
            } text-base font-bold px-5 rounded-r-2xl`}
          >
            Services
          </button>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </div>
  );
};

export default FavouriteItemsList;
