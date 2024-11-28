import React, { useContext } from "react";
import { FaCheck } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { toast } from "react-toastify";

const PackageCard = ({
  index,
  title,
  features,
  duration,
  endpoint,
  planType,
}) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const SubscribeFreePlan = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}${endpoint}`,
        {
          paymentMethodId: user?.stripeCustomer?.paymentMethod?.id,
          subscriptionName: planType,
        },
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

  const handleSubscription = () => {
    if (index === 0) {
      // Free Plan Logic
      SubscribeFreePlan();
    } else {
      // Navigate to Payment Page for Paid Plans
      // if(user?.stripeCustomerpaymentMethod?.id == null){
      navigate("/subscriptions/add-payment-details", {
        state: {
          plan: {
            title,
            duration,
            endpoint,
            planType,
            features,
          },
        },
      });
      // }
    }
  };

  return (
    <div className="border rounded-[30px] p-6 flex flex-col gap-1">
      <div className="w-full">
        <span className="blue-bg px-6 lg:px-10 py-2.5 rounded-full text-center text-white font-medium text-sm float-end">
          {planType}
        </span>
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
        className="blue-bg text-white font-bold text-center py-3.5 mt-5 rounded-[20px]"
      >
        Subscribe
      </button>
    </div>
  );
};

export default PackageCard;

{
  /* <Link
        to={
          index == 0 ? "/profile-setup" : "/subscriptions/add-payment-details"
        }
        className="blue-bg text-white font-bold text-center py-3.5 mt-5 rounded-[20px]"
      >
        Subscribe Now
      </Link> */
}
