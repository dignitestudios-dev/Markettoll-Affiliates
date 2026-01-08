import React, { useContext, useEffect, useState } from "react";
import ServiceBoostPackageCard from "../../components/AddService/ServiceBoostPackageCard";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { AuthContext } from "../../context/authContext";
import { BASE_URL } from "../../api/api";
import axios from "axios";
import { toast } from "react-toastify";

const SUBSCRIPTION_PLANS = [
  {
    title: "28.99",
    duration: "7 days",
    boostName: "Quick Start",
    features: [
      "7-day visibility: Elevate your listing for a week to capture maximum attention.",
      "Prioritized placement: Enjoy prominent positioning within your category.",
      "No automatic renewal: Maintain control over your spending.",
    ],
  },
  {
    title: "43.99",
    duration: "14 days",
    boostName: "Extended Exposure",
    features: [
      "14-day visibility: Double your listing's exposure for a sustained impact.",
      "Enhanced visibility: Gain greater prominence compared to standard listings.",
      "No recurring charges: Flexibility to choose when to boost again.",
    ],
  },
  {
    title: "84.99",
    duration: "30 days",
    boostName: "Maximum Impact",
    features: [
      "30-day visibility: Dominate your category with extended exposure.",
      "Premium placement: Enjoy top-tier positioning for optimal visibility.",
      "Non-renewable term: Take advantage of this limited-time offer to maximize your listing's reach.",
    ],
  },
];

const ServiceBoostPackagesPage = () => {
  const location = useLocation();
  const boostId = location?.state?.id;
  const navigate = useNavigate();
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const { user } = useContext(AuthContext);
  const [autoBoostChecked, setAutoBoostChecked] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setUserProfile(res?.data?.data);
    } catch (error) {
      console.log("error while fetch user profile >>>", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);
  useEffect(() => {
    if (
      userProfile?.subscriptionPlan?.availableBoosts > 0 &&
      !autoBoostChecked
    ) {
      setShowBoostModal(true);
      setAutoBoostChecked(true);
    }
  }, [userProfile, autoBoostChecked]);

  const handleBoostCount = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/users/product-boost-free-plan/${boostId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (res?.status === 201) {
        toast.success(res?.data?.message);
        fetchUserProfile();
        setShowBoostModal(false);
        navigate("/account/my-listings");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="padding-x w-full py-6">
      <div className="w-full bg-[#F7F7F7] rounded-[30px] px-4 lg:px-10 py-12 lg:py-16 relative flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          // to={location?.state ? location?.state?.from : "/"}
          className="flex items-center gap-1 absolute left-4 lg:left-10 top-6"
        >
          <GoArrowLeft className="text-xl light-blue-text" />
          <span className="text-sm font-medium text-[#5C5C5C]">Back</span>
        </button>
        <h2 className="text-2xl lg:text-[36px] font-bold blue-text">
          Boost Post
        </h2>
        <p className="text-[#5C5C5C] text-[18px] font-medium text-center lg:w-2/3">
          Gain more visibility and increase your chances of attracting renters
          by featuring your boat listing! A featured listing stands out among
          others, appearing at the top of search results and catching the eye of
          potential renters.
        </p>
        {userProfile?.subscriptionPlan?.availableBoosts > 0 &&
          !showBoostModal && (
            <button
              onClick={() => setShowBoostModal(true)}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Use Free Boost
            </button>
          )}

        <div className="w-full mt-6 flex items-center justify-center gap-6">
          {SUBSCRIPTION_PLANS.map((p, index) => {
            return (
              <ServiceBoostPackageCard
                boostName={p.boostName}
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
      {showBoostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md relative">
            {/* Close Button */}
            <button
              onClick={() => setShowBoostModal(false)}
              className="absolute top-4 right-4 text-gray-500 text-xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-center blue-text mb-4">
              Boost your product
            </h3>

            <p className="text-center text-gray-600 mb-6">
              You have{" "}
              <span className="font-semibold text-blue-600">
                {userProfile?.subscriptionPlan?.availableBoosts}
              </span>{" "}
              available boost
              {userProfile?.subscriptionPlan?.availableBoosts > 1 ? "s" : ""}.
            </p>

            <button
              onClick={handleBoostCount}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              {loading ? "Boosting" : "Boost Now"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceBoostPackagesPage;
