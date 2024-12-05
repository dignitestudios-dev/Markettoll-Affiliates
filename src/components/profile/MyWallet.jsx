import React, { useContext, useEffect, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import WithdrawFundModal from "./WithdrawFundModal";
import AddFundModal from "./AddFundModal";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";

const MyWallet = () => {
  const [connectCard, setConnectCard] = useState(true);
  const [cardAdded, setCardAdded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const { user, userProfile } = useContext(AuthContext);
  const [transactionHistory, setTransactionHistory] = useState([]);

  const handleTogglwWithdrawModal = () => {
    setShowModal(!showModal);
  };

  const handleConnectCard = () => {
    setConnectCard(!connectCard);
  };

  const handleToggleAddFundModal = () => {
    setShowFundModal(!showFundModal);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setConnectCard(!connectCard);
    setCardAdded(true);
  };

  const fetchTransactionhistory = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/users/transaction-history?page=1`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setTransactionHistory(res?.data?.data);
    } catch (error) {
      console.log(
        "erro while fetching transaction history >>>",
        error?.response?.data
      );
    }
  };

  useEffect(() => {
    fetchTransactionhistory();
  }, []);

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
                <button
                  type="button"
                  onClick={handleToggleAddFundModal}
                  className="light-blue-text underline tetx-sm"
                >
                  Add Fund
                </button>
              </div>
              <div className="w-full flex items-center justify-between mt-5">
                <div className="relative">
                  <span className="text-xs md:text-xl blue-text font-bold relative -top-1.5 lg:-top-4">
                    $
                  </span>
                  <span className="blue-text text-xl md:text-[45px] font-bold">
                    {userProfile?.walletBalance}
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
            <h3 className="blue-text text-base font-bold mb-4">Connect Card</h3>

            {userProfile && !userProfile?.stripeCustomer?.paymentMethodId ? (
              <div className="w-full flex flex-col items-start gap-3">
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
                      {
                        userProfile?.stripeConnectedAccount?.external_account
                          ?.last4
                      }
                    </span>
                  </div>
                  {userProfile?.stripeCustomer?.paymentMethodId && (
                    <MdOutlineKeyboardArrowRight className="text-xl light-blue-text" />
                  )}
                </button>
                {userProfile?.stripeConnectedAccount?.external_account?.id !==
                  "" ||
                  (userProfile?.stripeConnectedAccount?.external_account?.id !==
                    null && (
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
                  ))}
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col items-start gap-4"
              >
                <div className="w-full flex flex-col items-start gap-1">
                  <label
                    htmlFor="cardHolderName"
                    className="font-medium text-sm"
                  >
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Smith"
                    className="border rounded-2xl outline-none text-sm p-3 w-full"
                  />
                </div>
                <div className="w-full flex flex-col items-start gap-1">
                  <label htmlFor="cardNumber" className="font-medium text-sm">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000"
                    className="border rounded-2xl outline-none text-sm p-3 w-full"
                  />
                </div>
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="w-full flex flex-col items-start gap-1">
                    <label htmlFor="expiryDate" className="font-medium text-sm">
                      Valid Through
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="border rounded-2xl outline-none text-sm p-3 w-full"
                    />
                  </div>
                  <div className="w-full flex flex-col items-start gap-1">
                    <label htmlFor="cvc" className="font-medium text-sm">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="0000"
                      className="border rounded-2xl outline-none text-sm p-3 w-full"
                    />
                  </div>
                  <div className="w-full flex flex-col items-start gap-1">
                    <label htmlFor="zipCode" className="font-medium text-sm">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      placeholder="0000"
                      className="border rounded-2xl outline-none text-sm p-3 w-full"
                    />
                  </div>
                </div>
                <div className="w-full">
                  <button
                    type="submit"
                    className="blue-bg text-white font-bold py-3 rounded-2xl w-full"
                  >
                    Save
                  </button>
                </div>
              </form>
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
      />
    </div>
  );
};

export default MyWallet;
