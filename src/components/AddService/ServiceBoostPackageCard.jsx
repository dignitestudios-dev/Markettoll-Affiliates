import React from "react";
import { FaCheck } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const ServiceBoostPackageCard = ({ index, title, features, duration }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/boost-post");
  };

  return (
    <div
      className={`border relative rounded-[30px] p-6 lg:p-7 flex flex-col gap-1 w-full lg:w-[366px] ${
        index == 0 && "blue-bg"
      }`}
    >
      <div className="w-full absolute top-4 right-4">
        <span
          className={`${
            index == 0 ? "bg-white" : "blue-bg text-white"
          } px-6 lg:px-10 py-2.5 rounded-full text-center font-medium text-sm float-end`}
        >
          Plan {index + 1}
        </span>
      </div>
      <h3
        className={`${
          index == 0 ? "text-white" : "blue-text"
        } font-bold text-[81px]`}
      >
        <span className="text-[22px] relative -top-10">$</span>
        <span className="mx-1">{title}</span>
        <span className="text-[22px]">/ {duration}</span>
      </h3>
      <ul className={`${index == 0 && "bg-white p-4 rounded-xl"} p-4`}>
        {features?.map((p, index) => {
          return (
            <li key={index} className="flex items-center w-full gap-2 my-5">
              <div className="w-[17px] h-[17px] blue-bg p-0.5 rounded-full block">
                <FaCheck className="text-white w-full h-full" />
              </div>

              <span className="text-sm">{p}</span>
            </li>
          );
        })}
        <Link
          to={"/boost-post"}
          className={`blue-bg text-white font-bold text-center py-3.5 mt-5 rounded-[20px] w-full block`}
        >
          Subscribe Now
        </Link>
      </ul>
    </div>
  );
};

export default ServiceBoostPackageCard;
