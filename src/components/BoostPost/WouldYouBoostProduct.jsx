import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";

const WouldYouBoostProduct = () => {
  const product = JSON.parse(localStorage.getItem("product"));
  console.log(product.data);
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/choose-package-to-boost-service", {
      state: {
        from: window.location.href,
        type: "product",
        id: product?.data?._id,
      },
    });
  };
  return (
    <div className="w-full padding-x py-6">
      <div className="w-full p-5 lg:p-6 rounded-[30px] bg-[#F7F7F7]">
        <div className="w-full">
          <Link to="/product-review" className=" flex items-center gap-1">
            <GoArrowLeft className="light-blue-text text-xl" />
            <span className="text-sm font-medium text-[#5C5C5C]">Back</span>
          </Link>
        </div>
        <div className="w-full flex flex-col items-center justify-center gap-10">
          <h2 className="blue-text font-bold text-3xl lg:text-[36px] text-center">
            Would you like to boost your product?
          </h2>
          <img
            src="/boost-service-image.png"
            alt="boost-service-image"
            className="w-[157px] h-[157px]"
          />

          <button
            type="button"
            onClick={() => handleNavigate()}
            className="blue-bg text-white py-3.5 rounded-3xl w-full lg:w-[635px] text-center font-bold text-sm"
          >
            Yes, I Would Like To Boost My Post
          </button>
          <Link to="/" className="font-bold blue-text text-sm">
            No, I Would Boost Later
          </Link>
        </div>
        <></>
      </div>
    </div>
  );
};

export default WouldYouBoostProduct;
