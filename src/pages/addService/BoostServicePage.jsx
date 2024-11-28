import React from "react";
import { BsCheckLg } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";

const serviceFeatures = [
  "Lorem ipsum dolor sit amet consectetur.",
  "Lorem ipsum dolor sit amet consectetur.",
  "Lorem ipsum dolor sit amet consectetur.",
  "Lorem ipsum dolor sit amet consectetur.",
  "Lorem ipsum dolor sit amet consectetur.",
  "Lorem ipsum dolor sit amet consectetur.",
];

const BoostServicePage = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/choose-package-to-boost-service");
  };
  return (
    <div className="padding-x w-full">
      <div className="w-full bg-[#F7F7F7] rounded-[30px] relative py-12 px-4 lg:px-10 flex flex-col items-center gap-8">
        <Link
          to="/service-review"
          className="flex items-center gap-1 absolute left-4 lg:left-10 top-6"
        >
          <GoArrowLeft className="text-xl light-blue-text" />
          <span className="text-sm font-medium text-[#5C5C5C]">Back</span>
        </Link>
        <h2 className="text-2xl md:text-[36px] font-bold blue-text mt-4">
          Would you like to boost your Service?
        </h2>
        <img
          src="/boost-service-image.png"
          alt="boost-service-image"
          className="w-[157px] h-[157px]"
        />
        <ul className="">
          {serviceFeatures.map((s, index) => {
            return (
              <li key={index} className="flex items-center gap-2 mt-3.5">
                <div className="blue-bg rounded-full p-0.5 w-[21px] h-[21px]">
                  <BsCheckLg className="text-white w-full h-full" />
                </div>
                <span>{s}</span>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col items-center gap-5">
          <button
            type="button"
            onClick={handleNavigate}
            className="w-full lg:w-[635px] px-6 py-3 rounded-full blue-bg text-white text-base font-bold text-center"
          >
            Yes, I Would Like to Boost My Post
          </button>
          <Link to="/review-service" className="blue-text font-bold text-sm">
            No, I Would Boost Later
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BoostServicePage;
