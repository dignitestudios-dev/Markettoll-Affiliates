import React, { useContext, useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { CartProductContext } from "../../context/cartProductContext";
import { AuthContext } from "../../context/authContext";
import { BASE_URL } from "../../api/api";
import axios from "axios";
import { toast } from "react-toastify";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const SelectPaymentMethod = ({ onclick, count }) => {
  const [state, setState] = useState(false);
  const [openFundModal, setOpenFundMOdal] = useState(false);
  const { data, setData } = useContext(CartProductContext);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const { userProfile } = useContext(AuthContext);
  // console.log("userProfile >>>", userProfile);

  const handleToggleState = () => {
    setState(!state);
  };

  const handleToggleFundModal = () => {
    setOpenFundMOdal(!openFundModal);
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setData({ ...data, paymentMethod: method });
  };

  return (
    <div className="bg-white rounded-[20px] p-6 w-full">
      <div>
        <button
          type="button"
          onClick={onclick}
          className="flex items-center gap-1"
        >
          <GoArrowLeft className="text-xl light-blue-text" />
          <span className="text-sm font-medium text-gray-500">Black</span>
        </button>
      </div>
      <h2 className="text-[28px] font-bold blue-text mt-3">
        Select Payment Method
      </h2>

      <div className="flex flex-col items-start gap-3 mt-5 w-full">
        <div className="flex items-center gap-2 w-full">
          <input
            type="radio"
            name="paymentMethod"
            id="cardPayment"
            value={"Card"}
            onChange={() => handlePaymentMethodSelect("Card")}
            className="w-5 h-5"
          />
          <label
            htmlFor="cardPayment"
            className="bg-white border cursor-pointer rounded-[20px] px-3 py-3 text-sm w-full flex items-center justify-between"
          >
            <div className=" flex items-center gap-3">
              <img
                src="/mastercard-icon.png"
                alt="mastercard-icon"
                className="w-[24.79px] h-[15.33px]"
              />
              <span className="text-[#5C5C5C]">
                **** **** ****{" "}
                {userProfile?.stripeCustomer?.paymentMethod?.last4}
              </span>
            </div>
            <MdOutlineKeyboardArrowRight className="text-2xl light-blue-text" />
          </label>
        </div>

        <div className="flex items-center gap-2 w-full">
          <input
            type="radio"
            name="paymentMethod"
            id="walletPayment"
            value={"Pay via wallet"}
            onChange={() => handlePaymentMethodSelect("Pay via wallet")}
            className="w-5 h-5"
          />
          <label
            htmlFor="walletPayment"
            className="bg-white cursor-pointer border rounded-[20px] px-3 py-3 text-sm w-full flex items-center justify-between"
          >
            <div className=" flex items-center gap-3">
              <img
                src="/wallet-icon.png"
                alt="wallet-icon"
                className="w-[19.79px] h-[17.33px]"
              />
              <span className="text-[#5C5C5C]">Pay via Wallet</span>
            </div>
            <div className="flex items-center gap-5">
              <span className="text-[18px] font-medium">
                ${userProfile?.walletBalance.toFixed(2)}
              </span>
              <button
                type="button"
                onClick={handleToggleFundModal}
                className="light-blue-text underline"
              >
                Add Fund
              </button>
            </div>
          </label>
        </div>
        {!userProfile?.stripeCustomer?.paymentMethod?.last4 && (
          <button
            type="button"
            onClick={handleToggleState}
            className="flex items-center gap-2 w-full lg:pl-[3%]"
          >
            <div className="bg-white border rounded-[20px] px-3 py-3 text-sm w-full flex items-center justify-between">
              <div className=" flex items-center gap-3">
                <img
                  src="/credit-card-icon.png"
                  alt="credit-card-icon"
                  className="w-[20px] h-[20px]"
                />
                <span className="text-[#5C5C5C]">Add Debit/ Credit Card</span>
              </div>
              <MdOutlineKeyboardArrowRight className="text-2xl light-blue-text" />
            </div>
          </button>
        )}
      </div>

      <AddPaymentMethod state={state} onclick={handleToggleState} />
      <AddFund state={openFundModal} onclick={handleToggleFundModal} />
    </div>
  );
};

export default SelectPaymentMethod;

const AddPaymentMethod = ({ state, onclick }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, fetchUserProfile, userProfile } = useContext(AuthContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [addCard, setAddCard] = useState(false);
  // console.log("userProfile >>>", userProfile);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      if (!stripe || !elements) {
        console.log("Stripe.js has not loaded yet.");
        return;
      }

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        console.error("CardElement is not rendered.");
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        console.error(error);
        setIsProcessing(false);
        toast.error("Error processing payment method: " + error.message);
        return;
      }

      if (paymentMethod?.id) {
        try {
          const response = await axios.post(
            `${BASE_URL}/stripe/customer-card`,
            {
              paymentMethodId: paymentMethod?.id,
            },
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            }
          );

          // console.log("paymentMethodId added >>>", response);
          if (response?.data?.success) {
            fetchUserProfile();
            setAddCard(!addCard);
            onclick();
          }
        } catch (error) {
          setConnectCard(false);
          console.log(
            "error while adding paymentMethodId >>",
            error?.response?.data
          );
          onclick();
          toast.error(error?.response?.data?.message);
        }
      }
    } catch (error) {
      console.log("err while adding card >>>", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    state && (
      <div className="w-full h-screen bg-[rgba(0,0,0,0.5)] fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-[15px] p-8 relative w-[680px] h-auto flex flex-col items-center gap-3">
          <div className="w-full flex items-start justify-between mb-4">
            <div>
              <h3 className="text-[28px] blue-text font-bold">
                Add Your Card Details
              </h3>
              <p className="text-[18px] font-medium text-[#5C5C5C]">
                Kindly Add your debit or credit card details.
              </p>
            </div>
            <button
              type="button"
              onClick={onclick}
              className="w-6 h-6 bg-[#F7F7F7] rounded-full p-1"
            >
              <IoClose className="w-full h-full" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-start gap-4"
          >
            <div className="w-full flex flex-col items-center gap-5 mt-10">
              <div className="w-full flex flex-col items-start gap-1 lg:w-[605px]">
                <label htmlFor="cardHolderName" className="font-medium text-sm">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  id="cardHolderName"
                  name="cardHolderName"
                  placeholder="John Smith"
                  className="w-full bg-white border rounded-full px-4 py-3.5 text-sm text-[#5C5C5C] outline-none"
                />
              </div>

              <div className="w-full lg:w-[605px]">
                <label htmlFor="cardDetails" className="font-medium text-sm">
                  Card Details
                </label>
                <CardElement className="w-full bg-white rounded-full border px-6 py-4 text-sm text-[#5C5C5C] outline-none" />
              </div>

              <div className="w-full lg:w-[605px] mt-2">
                <button
                  type="submit"
                  // disabled={!stripe}
                  // onClick={handleSubmit}
                  className="py-3 px-10 rounded-full w-full blue-bg text-white font-bold text-base"
                >
                  {isProcessing ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </form>
          {/* <button
            type="button"
            onClick={onclick}
            className="text-base rounded-[16px] w-full py-3 blue-bg text-white font-bold"
          >
            Add
          </button> */}
        </div>
      </div>
    )
  );
};

const AddFund = ({ state, onclick }) => {
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const { user, userProfile, fetchUserProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");

  const handleToggleSuccessModal = () => {
    setOpenSuccessModal(!openSuccessModal);
    onclick();
  };

  const addFunds = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/stripe/add-funds-to-wallet`,
        { amount },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Add fund res >>>>>", res);
      if (res.status == 201) {
        // handleToggleSuccessModal();
        onclick();
        fetchUserProfile();
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("add fund err >>>>>", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    state && (
      <div className="w-full h-screen bg-[rgba(0,0,0,0.5)] fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-[15px] p-8 relative w-[680px] h-auto flex flex-col items-center gap-3">
          <div className="w-full flex items-start justify-between mb-4">
            <div>
              <h3 className="text-[28px] blue-text font-bold">Add Fund</h3>
            </div>
            <button
              type="button"
              onClick={onclick}
              className="w-6 h-6 bg-[#F7F7F7] rounded-full p-1"
            >
              <IoClose className="w-full h-full" />
            </button>
          </div>

          <div className="w-full flex flex-col items-start gap-1">
            <div className="bg-[#F5F5F5] rounded-[16px] px-4 w-full flex items-center gap-3">
              <img
                src="/mastercard-icon.png"
                alt="mastercard-icon"
                className="w-[24.79px] h-[15.33px]"
              />
              <input
                type="text"
                id="cardHolderName"
                name="cardHolderName"
                disabled
                placeholder={`**** **** **** `}
                className=" py-3 text-sm w-full outline-none"
              />
            </div>
          </div>

          <div className="w-full flex items-center justify-between my-4 gap-1">
            <span className="text-sm font-medium">
              Available Wallet balance
            </span>
            <span className="text-sm font-bold">
              ${userProfile?.walletBalance.toFixed(2)}
            </span>
          </div>

          <div className="w-full flex flex-col items-start gap-1">
            <label htmlFor="amount" className="text-[13px] font-medium">
              Enter Amount
            </label>
            <div className="w-full bg-white rounded-[16px] px-4 border flex items-center gap-2">
              <span className="light-blue-text font-bold">$</span>
              <input
                type="text"
                id="amount"
                name="amount"
                placeholder="120"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className=" py-3 text-sm w-full outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => addFunds()}
            className="text-base rounded-[16px] w-full py-3 blue-bg text-white font-bold mt-4"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
        <AddFundSuccess
          openSuccessModal={openSuccessModal}
          onclick={handleToggleSuccessModal}
        />
      </div>
    )
  );
};

const AddFundSuccess = ({ openSuccessModal, onclick }) => {
  return (
    openSuccessModal && (
      <div className="w-full h-screen bg-[rgba(0,0,0,0.5)] fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-[15px] p-8 relative w-[440px] h-auto flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onclick}
            className="w-6 h-6 bg-[#F7F7F7] rounded-full p-1 absolute top-4 right-4"
          >
            <IoClose className="w-full h-full" />
          </button>
          <div className="w-[69.67px] h-[69.67px] rounded-full blue-bg p-3">
            <FaCheck className="w-full h-full text-white" />
          </div>
          <h3 className="text-[18px] blue-text font-bold">Add Fund</h3>
          <h4 className="text-[18px] blue-text font-bold">$120.00</h4>
          <p className="text-base text-[#5C5C5C]">
            Funds has been added to your wallet
          </p>
        </div>
      </div>
    )
  );
};
