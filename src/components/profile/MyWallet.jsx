import React, { useContext, useEffect, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import WithdrawFundModal from "./WithdrawFundModal";
import AddFundModal from "./AddFundModal";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import SettingsAddBankAccount from "../../pages/settings/SettingsAddBankAccount";
import { useNavigate } from "react-router-dom";

const MyWallet = () => {
  const { user, userProfile, fetchUserProfile } = useContext(AuthContext);
  const [connectCard, setConnectCard] = useState(
    userProfile?.stripeCustomer?.id ? false : true
  );
  const [cardAdded, setCardAdded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [WalletInfo, setWalletInfo] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  console.log(userProfile, "user");
  const handleTogglwWithdrawModal = () => {
    setShowModal(!showModal);
  };

  const handleConnectCard = () => {
    setConnectCard(!connectCard);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!stripe || !elements) {
        console.log("Stripe.js has not loaded yet.");
        toast.error("Something went wrong.");
        return;
      }

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        console.error("CardElement is not rendered.");
        toast.error("Something went wrong.");
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

      // console.log("PaymentMethod Created:", paymentMethod.id);
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
          }
        } catch (error) {
          setConnectCard(false);
          console.log(
            "error while adding paymentMethodId >>",
            error?.response?.data
          );
          toast.error(error?.response?.data?.message);
        }
      }
    } catch (error) {
      console.log("err while adding card >>>", error);
    }
  };

  const fetchTransactionhistory = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/${
          userProfile.role != "influencer"
            ? "users/transaction-history?page=1"
            : "influencer/my-payouts"
        }`,
        {
          headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
        }
      );
      setTransactionHistory(res?.data?.data);
      // console.log(res);
    } catch (error) {
      console.log(
        "erro while fetching transaction history >>>",
        error?.response?.data
      );
    }
  };

  const fetchWalletInformation = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/influencer/my-wallet?page=1`, {
        headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
      });
      setWalletInfo(res?.data?.data?.amount);
      console.log(res, "wallet res");
    } catch (error) {
      console.log(
        "erro while fetching transaction history >>>",
        error?.response?.data
      );
    }
  };

  useEffect(() => {
    fetchWalletInformation();
    fetchTransactionhistory();
  }, [showModal, showFundModal]);

  const handleToggleAddFundModal = () => {
    setShowFundModal(!showFundModal);
    if (!showFundModal) {
      fetchTransactionhistory();
    }
  };
  console.log(WalletInfo);

  return (
    <div className="w-full p-4 rounded-xl bg-[#F5F5F5]">
      <div className="w-full bg-white rounded-xl p-6">
        <h2 className="text-[28px] font-bold blue-text">Wallet</h2>
        <div className="w-full mt-5 grid grid-cols-1 lg:grid-cols-2 gap-y-6 gap-x-10">
          <div className="">
            <div className="w-full bg-[#F5F5F5] rounded-xl p-5">
              <div className="w-full flex items-center justify-between">
                <span className="text-[#959595] text-lg font-medium">
                  Available Balance
                </span>
                {user.role == "client" && (
                  <button
                    type="button"
                    onClick={handleToggleAddFundModal}
                    className="light-blue-text underline tetx-sm"
                  >
                    Add Fund
                  </button>
                )}
              </div>
              <div className="w-full flex items-center justify-between mt-5">
                <div className="relative">
                  <span className="text-xs md:text-xl blue-text font-bold relative -top-1.5 lg:-top-4">
                    $
                  </span>
                  <span className="blue-text text-xl md:text-[45px] font-bold">
                    {userProfile?.role == "user"
                      ? userProfile?.walletBalance
                      : WalletInfo}
                  </span>
                  <span className="text-sm md:text-xl text-[#959595]">USD</span>
                </div>
                <button
                  type="button"
                  onClick={handleTogglwWithdrawModal}
                  className="blue-bg text-white text-xs md:text-base font-bold px-4 py-2 rounded-xl"
                >
                  Withdraw
                </button>
              </div>
            </div>
            <div className="mt-5">
              <h4 className="text-base font-normal blue-text">
                Withdraw History
              </h4>

              {transactionHistory?.length > 0 ? (
                <>
                  {transactionHistory?.map((history, index) => {
                    return (
                      <div
                        className="w-full grid grid-cols-3 border-b py-3"
                        key={index}
                      >
                        <div>
                          <span className="text-[#646565] text-[13px]">
                            {history?.createdAt
                              ? new Date(history.createdAt).toLocaleDateString(
                                  "en-GB"
                                )
                              : "N/A"}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-[#646565] text-[13px]">
                            {history?.type == "credit" ? "Credit" : "Debit"}
                          </span>
                        </div>
                        <div className="text-end">
                          <span className="text-[#000] text-[13px]">
                            ${history?.amount?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="w-full">
                  <h2>No Transactions </h2>
                </div>
              )}
            </div>
          </div>

          <div>
            {userProfile?.role != "influencer" && (
              <>
                <h3 className="blue-text text-base font-bold mb-4">
                  {userProfile && userProfile?.stripeCustomer?.id
                    ? "Connected Card"
                    : "Connect Card"}
                </h3>

                <div className="w-full flex flex-col items-start gap-3">
                  <div className="w-full">
                    {userProfile?.stripeCustomer?.id && (
                      <button
                        type="button"
                        onClick={handleConnectCard}
                        className="flex items-center justify-between w-full custom-shadow py-4 px-4 rounded-xl"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src="/mastercard-icon.png"
                            alt="master card icon"
                            className="w-[24.79px] h-[15.33px]"
                          />
                          <span className="text-sm text-[#5C5C5C]">
                            **** **** ****{" "}
                            {userProfile?.stripeCustomer?.paymentMethod?.last4}
                          </span>
                        </div>
                        {userProfile?.stripeCustomer?.paymentMethodId && (
                          <MdOutlineKeyboardArrowRight className="text-xl light-blue-text" />
                        )}
                      </button>
                    )}
                  </div>

                  {userProfile?.stripeCustomer?.id ? (
                    <></>
                  ) : (
                    <>
                      {!connectCard ? (
                        <button
                          type="button"
                          onClick={handleConnectCard}
                          className="flex items-center justify-between w-full custom-shadow py-4 px-4 rounded-xl"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src="/credit-card-icon.png"
                              alt="credit card icon"
                              className="w-[20px] h-[20px]"
                            />
                            <span className="text-sm text-[#5C5C5C]">
                              Add Debit/ Credit Card
                            </span>
                          </div>
                          <MdOutlineKeyboardArrowRight className="text-xl light-blue-text" />
                        </button>
                      ) : (
                        <form
                          onSubmit={handleSubmit}
                          className="w-full flex flex-col items-start gap-4"
                        >
                          <div className="w-full flex flex-col items-center gap-5 mt-10">
                            <div className="w-full flex flex-col items-start gap-1 lg:w-[605px]">
                              <label
                                htmlFor="cardHolderName"
                                className="font-medium text-sm"
                              >
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
                              <label
                                htmlFor="cardDetails"
                                className="font-medium text-sm"
                              >
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
                                Save
                              </button>
                            </div>
                          </div>
                        </form>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
            {userProfile?.role == "influencer" && (
              <div>
                {!userProfile?.stripeConnectedAccount?.external_account
                  ?.routingNumber ? (
                  <>
                    <h3 className="blue-text text-base font-bold mt-4">
                      Add Bank
                    </h3>
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(
                            `${BASE_URL}/stripe/setup-stripe`,
                            {
                              method: "GET",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${user?.token}`, // Include token here
                              },
                            }
                          );

                          if (!res.ok) {
                            const errorData = await res.json();
                            throw new Error(
                              errorData.message || "Something went wrong"
                            );
                          }

                          const data = await res.json();
                          console.log(data, "datasslink");
                          window.open(data?.data?.url, "_blank");
                        } catch (error) {
                          toast.error(`Error: ${error.message}`);
                        }
                      }}
                      className="bg-[#0098EA] px-5 p-3 rounded-lg mt-2 text-white"
                    >
                      Create Connected Account
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled={userProfile?.stripeConnectedAccount?.id}
                    onClick={() => setState(!state)}
                    className="mt-4 flex items-center justify-between custom-shadow py-4 px-5 rounded-2xl w-full"
                  >
                    <div className="flex items-center gap-2">
                      <img src="/bank.png" alt="bank" className="w-5 h-5" />
                      <span className="text-sm text-[#5C5C5C]">
                        {userProfile?.stripeConnectedAccount?.external_account
                          ?.id
                          ? ` **** **** ****
                              ${userProfile?.stripeConnectedAccount?.external_account?.last4}`
                          : `Add Bank Account`}
                      </span>
                    </div>
                    <MdOutlineKeyboardArrowRight className="light-blue-text text-2xl" />
                  </button>
                )}

                {/* <SettingsAddBankAccount /> */}
              </div>
            )}
          </div>
        </div>
      </div>
      <WithdrawFundModal
        showModal={showModal}
        setShowModal={setShowModal}
        onclick={handleTogglwWithdrawModal}
      />
      <AddFundModal
        showFundModal={showFundModal}
        setShowFundModal={setShowFundModal}
        onclick={handleToggleAddFundModal}
        currentBalance={userProfile?.walletBalance}
      />
    </div>
  );
};

export default MyWallet;
