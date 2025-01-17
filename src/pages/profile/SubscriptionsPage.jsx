import React, { useContext, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { SUBSCRIPTION_PLANS } from "../../constants/subscriptions";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe, Elements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import ButtonLoader from "../../components/Global/ButtonLoader";

const stripePromise = loadStripe(
  "pk_test_51OsZBgRuyqVfnlHK0Z5w3pTL7ncHPcC75EwkxqQX9BAlmcXeKappekueIzmpWzWYK9L9HEGH3Y2Py2hC7KyVY0Al00przQczPf"
);

const SubscriptionsPage = () => {
  return (
    // <Elements stripe={stripePromise}>
    <div className="padding-x py-6 w-full">
      <div className="rounded-2xl p-5 bg-[#F7F7F7]">
        <div className="w-full p-6 bg-white rounded-2xl">
          <Link to="/" className="flex items-center justify-start gap-1 w-20">
            <GoArrowLeft className="light-blue-text text-xl" />
            <span className="text-sm font-medium text-[#5c5c5c]">Back</span>
          </Link>
          <h2 className="blue-text font-bold text-[28px] text-start mt-3">
            Subscriptions
          </h2>

          <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {SUBSCRIPTION_PLANS.map((p, index) => {
              return (
                <PackageCard
                  key={index}
                  index={index}
                  title={p.title}
                  features={p.features}
                  duration={p.duration}
                  endpoint={p.endpoint}
                  planType={p.planType}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
    // </Elements>
  );
};

export default SubscriptionsPage;

const PackageCard = ({
  index,
  title,
  features,
  duration,
  endpoint,
  planType,
}) => {
  const { user, fetchUserProfile, userProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(!showModal);
  };

  const SubscribeFreePlan = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}${endpoint}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log(`FreePlan Subscription Success:`, response.data);
      if (response.data.success) {
        navigate("/profile-setup");
      }
    } catch (error) {
      console.error(
        `FreePlan Subscription Failed:`,
        error.response ? error.response.data : error.message
      );
      toast.error(error.response.data?.message);
    }
  };

  const handleSubscription = async () => {
    setLoading(true);
    if (userProfile?.subscriptionPlan?.name === "Free Plan") {
      navigate("/account/subscriptions/upgrade-plan/add-payment-details", {
        state: {
          from: window.location.href,
          plan: {
            index,
            title,
            features,
            duration,
            endpoint,
            planType,
          },
        },
      });
    } else {
      try {
        // Check if user has a plan
        if (userProfile?.subscriptionPlan?.name === "No Plan") {
          // User has no plan, directly subscribe
          const res = await axios.post(
            `${BASE_URL}/stripe/subscribe-paid-plan-stripe`,
            {
              subscriptionName: planType,
              paymentMethodId: user.stripeCustomer.paymentMethod.id,
            },
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            }
          );
          // console.log("handle Subscription (No Plan) res >>>>>", res);
          if (res?.status === 201) {
            fetchUserProfile();
            handleCloseModal();
            toast.success(res?.data?.message);
            navigate("/account/subscriptions");
          } else {
            toast.error("Something went wrong while subscribing.");
          }
        } else {
          // User already has a plan, proceed to unsubscribe and re-subscribe
          try {
            const unsubscribeResponse = await axios.post(
              `${BASE_URL}/stripe/unsubscribe-paid-plan-stripe`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${user?.token}`,
                },
              }
            );

            if (unsubscribeResponse?.status === 200) {
              const res = await axios.post(
                `${BASE_URL}/stripe/subscribe-paid-plan-stripe`,
                {
                  subscriptionName: planType,
                  paymentMethodId: user.stripeCustomer.paymentMethod.id,
                },
                {
                  headers: {
                    Authorization: `Bearer ${user?.token}`,
                  },
                }
              );
              console.log("handle Upgrade subscription res >>>>>", res);
              if (res?.status === 201) {
                fetchUserProfile();
                handleCloseModal();
              }
            } else {
              toast.error("Something went wrong during unsubscribe.");
            }
          } catch (error) {
            console.log(
              "error while unsubscribing plan >>>>",
              error?.response?.data?.message
            );
            toast.error("Something went wrong during unsubscribing.");
          }
        }
      } catch (error) {
        console.error("handle Subscription error >>>>>", error);
        toast.error(error?.response?.data?.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="border rounded-[30px] px-3 p-6 flex flex-col justify-between gap-1">
      <div className="w-full flex items-center justify-between">
        <span className="blue-bg px-4 md:px-6 py-2.5 rounded-full text-center text-white font-medium text-sm float-end">
          {planType}
        </span>
        {userProfile?.subscriptionPlan?.name == planType ? (
          <span className="bg-red-500 px-3 py-1.5 rounded-full text-center text-white font-medium text-sm float-end">
            Subscribed
          </span>
        ) : null}
      </div>
      <h3 className="blue-text font-bold text-[52px]">
        {index == 0 ? (
          "Free Plan"
        ) : (
          <>
            <span className="text-[22px] relative -top-5">$</span>
            <span className="mx-1">{title}</span>
            <span className="text-[22px]">/ {duration}</span>
          </>
        )}
      </h3>
      <ul>
        {features?.map((p, index) => {
          return (
            <li key={index} className="flex items-center w-full gap-2 mt-3.5">
              <div className="w-[17px] h-[17px] blue-bg p-0.5 rounded-full block">
                <FaCheck className="text-white w-full h-full" />
              </div>

              <span>{p}</span>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => handleSubscription()}
        disabled={userProfile?.subscriptionPlan?.name == planType}
        className="blue-bg text-white font-bold text-center py-3 mt-5 rounded-[20px] disabled:cursor-not-allowed h-[50px]"
      >
        {loading ? <ButtonLoader /> : "Upgrade"}
      </button>
      <PlanPurchaseSuccessModal
        showModal={showModal}
        onclick={handleCloseModal}
      />
    </div>
  );
};

const PlanPurchaseSuccessModal = ({ onclick, showModal }) => {
  return (
    showModal && (
      <div
        className={`w-full h-screen bg-[rgba(0,0,0,0.3)] fixed inset-0 z-40 flex items-center justify-center padding-x`}
      >
        <div className="w-full bg-white lg:w-[440px] h-[244px] rounded-[16px] flex flex-col items-center justify-center relative gap-2">
          <button
            type="button"
            onClick={onclick}
            className="w-[30px] h-[30px] bg-gray-200 absolute top-4 right-4 rounded-full p-1"
          >
            <IoClose className="w-full h-full" />
          </button>
          <div className="w-[69.67px] h-[69.67px] rounded-full blue-bg flex items-center justify-center p-2.5">
            <FaCheck className="w-full h-full text-white" />
          </div>
          <span className="text-[20px] font-bold blue-text">
            Congratulations!
          </span>
          <span className="text-base font-normal text-[#5C5C5C]">
            You have successfully Purchase plan.
          </span>
        </div>
      </div>
    )
  );
};
