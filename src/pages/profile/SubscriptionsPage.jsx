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
          <h2 className="blue-text font-bold text-[28px] text-center">
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
  const { user } = useContext(AuthContext);
  // console.log("user >>>", user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
    try {
      if (index === 0) {
        // Free Plan Logic
        SubscribeFreePlan();
      } else {
        // Paid Plan Logic
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
      }
    } catch (error) {
      console.error("handle Upgrade subscription err >>>>>", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-[30px] p-6 flex flex-col justify-between gap-1">
      <div className="w-full flex items-center justify-between">
        <span className="blue-bg px-6 py-2.5 rounded-full text-center text-white font-medium text-sm float-end">
          {planType}
        </span>
        {user?.subscriptionPlan?.name == planType ? (
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
        onClick={handleSubscription}
        disabled={user?.subscriptionPlan?.name == planType}
        className="blue-bg text-white font-bold text-center py-3.5 mt-5 rounded-[20px] disabled:cursor-not-allowed"
      >
        {loading ? "Upgrading..." : "Upgrade"}
      </button>
    </div>
  );
};
