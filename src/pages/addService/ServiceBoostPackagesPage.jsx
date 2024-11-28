import React from "react";
// import { SUBSCRIPTION_PLANS } from "../../constants/subscriptions";
import ServiceBoostPackageCard from "../../components/AddService/ServiceBoostPackageCard";
import { Link } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";

const SUBSCRIPTION_PLANS = [
  {
    title: "2.99",
    duration: "7 days",
    features: [
      "Lorem ipsum dolor sit amet consectetur.",
      "Lorem ipsum dolor sit amet consectetur.",
      "Lorem ipsum dolor sit amet consectetur.",
      "Lorem ipsum dolor sit amet consectetur.",
      "Lorem ipsum dolor sit amet consectetur.",
    ],
  },
  {
    title: "5.99",
    duration: "14 days",
    features: [
      "Lorem ipsum dolor sit amet consectetur.",
      "Lorem ipsum dolor sit amet consectetur.",
      "Lorem ipsum dolor sit amet consectetur.",
      "Lorem ipsum dolor sit amet consectetur.",
      "Lorem ipsum dolor sit amet consectetur.",
    ],
  },
  {
    title: "9.99",
    duration: "month",
    features: [
      "Lorem ipsum dolor sit amet consectetur.",
      "Lorem ipsum dolor sit amet consectetur.",
      "Lorem ipsum dolor sit amet consectetur.",
      "Lorem ipsum dolor sit amet consectetur.",
      "Lorem ipsum dolor sit amet consectetur.",
    ],
  },
];

const ServiceBoostPackagesPage = () => {
  return (
    <div className="padding-x w-full">
      <div className="w-full bg-[#F7F7F7] rounded-[30px] px-4 lg:px-10 py-12 lg:py-16 relative flex flex-col items-center gap-4">
        <Link
          to="/service-review"
          className="flex items-center gap-1 absolute left-4 lg:left-10 top-6"
        >
          <GoArrowLeft className="text-xl light-blue-text" />
          <span className="text-sm font-medium text-[#5C5C5C]">Back</span>
        </Link>
        <h2 className="text-2xl lg:text-[36px] font-bold blue-text">
          Boost Post
        </h2>
        <p className="text-[#5C5C5C] text-[18px] font-medium text-center lg:w-2/3">
          Gain more visibility and increase your chances of attracting renters
          by featuring your boat listing! A featured listing stands out among
          others, appearing at the top of search results and catching the eye of
          potential renters.
        </p>

        <div className="w-full mt-6 flex items-center justify-center gap-6">
          {SUBSCRIPTION_PLANS.map((p, index) => {
            return (
              <ServiceBoostPackageCard
                key={index}
                index={index}
                title={p.title}
                features={p.features}
                duration={p.duration}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServiceBoostPackagesPage;
