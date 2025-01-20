import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { BASE_URL } from "../../api/api";
import ButtonLoader from "../../components/Global/ButtonLoader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SettingsAddCard = () => {
  const { user, userProfile, fetchUserProfile } = useContext(AuthContext);
  const [isCardAdded, setIsCardAdded] = useState(false);
  const elements = useElements();
  const stripe = useStripe();
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOpenForm = () => {
    setIsCardAdded(!isCardAdded);
  };

  const handleAddCardFalse = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!stripe || !elements) {
        console.log("Stripe.js has not loaded yet.");
        toast.error("Something went wrong");
        return;
      }

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        console.error("CardElement is not rendered.");
        toast.error("Something went wrong");
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        // console.error(error);
        toast.error("Error processing payment method: " + error.message);
        return;
      }

      //   console.log("PaymentMethod Created:", paymentMethod.id);
      setPaymentMethodId(paymentMethod?.id);
      if (paymentMethod?.id) {
        if (paymentMethodId) {
          try {
            const response = await axios.post(
              `${BASE_URL}/stripe/customer-card`,
              {
                paymentMethodId: paymentMethodId,
              },
              {
                headers: {
                  Authorization: `Bearer ${user?.token}`,
                },
              }
            );

            // console.log("subscription purchased >>>", response);
            if (response?.data?.success) {
              fetchUserProfile();
              handleOpenForm();
              toast.success("Card added successfully");
              navigate(-1);
            }
          } catch (error) {
            // console.log("error while adding payment method id >>", error);
            toast.error(error?.response?.data?.message);
          }
        } else {
          toast.error("Something went wrong");
        }
      }
    } catch (error) {
      //   console.log("err while adding card >>>", error?.response?.data);
      toast.error(error?.response?.data?.message);
      handleOpenForm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isCardAdded ? (
        <form
          onSubmit={handleAddCardFalse}
          className="w-full flex flex-col items-start gap-5 mb-5"
        >
          <div className="w-full flex flex-col items-start gap-1">
            <label htmlFor="cardHolderName" className="text-[13px] font-medium">
              Card Holder Name
            </label>
            <input
              type="text"
              placeholder="John Smith"
              required
              className="border rounded-2xl px-4 py-3.5 outline-none w-full text-sm"
            />
          </div>
          <div className="w-full">
            <label htmlFor="cardDetails" className="font-medium text-sm">
              Card Details
            </label>
            <CardElement className="w-full bg-white border rounded-2xl px-4 py-3.5 text-sm text-[#5C5C5C] outline-none" />
          </div>
          <button
            type="submit"
            className="text-base font-bold py-3 w-full text-white blue-bg rounded-2xl"
          >
            {loading ? <ButtonLoader /> : "Add"}
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={handleOpenForm}
          disabled={userProfile?.stripeCustomer?.id}
          className="mt-4 flex items-center justify-between custom-shadow py-4 px-5 rounded-2xl w-full"
        >
          <div className="flex items-center gap-2">
            <img
              src="/mastercard-icon.png"
              alt="mastercard-icon"
              className="w-[24.79px] h-[15.33px]"
            />
            <span className="text-sm text-[#5C5C5C]">
              Add Credit/Debit Card
            </span>
          </div>
          <MdOutlineKeyboardArrowRight className="light-blue-text text-2xl" />
        </button>
      )}
    </div>
  );
};

export default SettingsAddCard;
