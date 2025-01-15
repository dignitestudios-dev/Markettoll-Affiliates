import React, { useContext, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import ButtonLoader from "../Global/ButtonLoader";

const ServiceBoostPackageCard = ({
  index,
  title,
  features,
  duration,
  boostName,
}) => {
  const navigate = useNavigate();

  const { userProfile, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showSuccessMoal, setShowSuccessModal] = useState(false);
  const location = useLocation();

  const handleNavigate = async () => {
    if (
      userProfile?.stripeCustomer?.id === null ||
      userProfile?.stripeCustomer?.id === undefined
    ) {
      navigate("/boost-post", {
        state: {
          plan: {
            title,
            duration,

            features,
            index,
          },
        },
      });
    } else {
      setLoading(true);
      let URL;
      if (
        location?.state?.type === "service" ||
        location?.state?.type === "edit-service"
      ) {
        URL = `${BASE_URL}/stripe/service-boost-paid-plan-stripe/${location?.state?.id}`;
      } else if (location?.state?.type === "product") {
        URL = `${BASE_URL}/stripe/product-boost-paid-plan-stripe/${location?.state?.id}`;
      }
      try {
        const res = await axios.post(
          URL,
          {
            boostName,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        console.log("servide boost res >>>", res);
        if (res?.status == 201) {
          setShowPlanModal(true);
          setTimeout(() => {
            setShowPlanModal(false);
            setShowSuccessModal(true);
          }, 2000);
        }
      } catch (error) {
        console.log("error while boosting service 1 >>>>", error);
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
      if (location?.state?.from === "/my-listings") {
        try {
          const res = await axios.post(
            URL,
            {
              boostName,
            },
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            }
          );
          console.log("servide boost res >>>", res);
          if (res?.status == 201) {
            setShowPlanModal(true);
            setTimeout(() => {
              setShowPlanModal(false);
              setShowSuccessModal(true);
            }, 2000);
          }
        } catch (error) {
          console.log("error while boosting service 2 >>>>", error);
          toast.error(error?.response?.data?.message);
        } finally {
          setLoading(false);
        }
      } else {
      }
    }
  };

  const handleClosePlanModal = () => {
    setShowPlanModal(false);
    setShowSuccessModal(true);
  };
  const handleClosePlanModal2 = () => {
    setShowPlanModal(false);
    setShowSuccessModal(false);
    navigate("/");
  };

  return (
    <>
      <div
        className={`relative rounded-[30px] p-6 lg:p-7 flex flex-col gap-1 w-full lg:w-[366px] ${
          index == 0 ? "bg-white" : "bg-white"
        }`}
      >
        <div className="w-full ">
          <span
            className={`blue-bg text-white px-6 py-2.5 rounded-full text-center font-medium text-sm float-end`}
          >
            {boostName}
          </span>
        </div>
        <h3 className={`blue-text font-bold text-[61px]`}>
          <span className="text-[22px] relative -top-7">$</span>
          <span className="mx-1">{title}</span>
          <span className="text-[22px]">/ {duration}</span>
        </h3>
        <ul className={`p-4`}>
          {features?.map((p, index) => {
            return (
              <li key={index} className="flex items-center w-full gap-2 my-5">
                <div className="w-[10%]">
                  <div className="w-[17px] h-[17px] blue-bg p-1 rounded-full block">
                    <FaCheck className="text-white w-full h-full" />
                  </div>
                </div>

                <span className="text-sm">{p}</span>
              </li>
            );
          })}
          <button
            type="button"
            onClick={() => handleNavigate()}
            className={`blue-bg text-white font-bold text-center py-3 rounded-[20px] w-full block h-[50px] ${
              index === 0 ? "mt-2" : "mt-5"
            }`}
          >
            {loading ? <ButtonLoader /> : "Subscribe Now"}
          </button>
        </ul>
      </div>
      <Modal1
        showPlanModal={showPlanModal}
        handleClose={handleClosePlanModal}
      />
      <Modal2
        showSuccessMoal={showSuccessMoal}
        handleClose={handleClosePlanModal2}
      />
    </>
  );
};

export default ServiceBoostPackageCard;

const Modal1 = ({ showPlanModal, handleClose }) => {
  return (
    showPlanModal && (
      <div className="w-full h-screen fixed inset-0 z-[1000000] bg-[rgba(0,0,0,0.2)] flex items-center justify-center">
        <div className="w-full lg:w-[440px] p-10 rounded-[20px] bg-white relative flex flex-col items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleClose} // Corrected here
            className="w-6 h-6 bg-gray-200 rounded-full p-1 absolute top-5 right-5"
          >
            <IoClose className="w-full h-full" />
          </button>

          <div className="w-[69.67px] h-[69.67px] blue-bg rounded-full p-4">
            <FaCheck className="text-white w-full h-full" />
          </div>
          <h2 className="font-bold blue-text text-xl">Congratulations!</h2>
          <p className="text-base text-[#5C5C5C]">
            You have successfully purchased the plan.
          </p>
        </div>
      </div>
    )
  );
};

const Modal2 = ({ showSuccessMoal, handleClose }) => {
  return (
    showSuccessMoal && (
      <div className="w-full h-screen fixed inset-0 z-[10000000000] bg-[rgba(0,0,0,0.2)] flex items-center justify-center">
        <div className="w-full lg:w-[440px] p-10 rounded-[20px] bg-white relative flex flex-col items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleClose} // Corrected here
            className="w-6 h-6 bg-gray-200 rounded-full p-1 absolute top-5 right-5"
          >
            <IoClose className="w-full h-full" />
          </button>

          <div className="w-[69.67px] h-[69.67px] blue-bg rounded-full p-4">
            <FaCheck className="text-white w-full h-full" />
          </div>
          <h2 className="font-bold blue-text text-xl">Post Boosted</h2>
          <p className="text-base text-[#5C5C5C]">
            Your post has been boosted successfully!
          </p>
        </div>
      </div>
    )
  );
};
