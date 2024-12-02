import axios from "axios";
import React, { useContext, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";

const SettingsPayementPage = () => {
  const { user, fetchUserProfile, userProfile } = useContext(AuthContext);
  const [openForm, setOpenForm] = useState(false);
  const [isCardAdded, setIsCardAdded] = useState(false);
  const [isBankAccountAdded, setIsBankAccountAdded] = useState(false);
  const [addingAccount, setAddingAccount] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    routingNumber: "",
  });
  const [dateOfBirth, setDateOfBirth] = useState({
    day: "",
    month: "",
    year: "",
  });
  const [ssn, setSsn] = useState("");
  console.log("userProfile >>", userProfile);

  const handleBankDetailsChange = (e) => {
    const { id, value } = e.target;
    setBankDetails((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleDateOfBirthChange = (e) => {
    const { id, value } = e.target;
    setDateOfBirth((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleOpenForm = () => {
    setOpenForm(!openForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleOpenForm();
    setIsCardAdded(true);
  };

  const handleAddbankAccount = async (e) => {
    e.preventDefault();
    setAddingAccount(true);
    const data = { bankDetails, dateOfBirth, idNumber: ssn };
    try {
      const res = await axios.post(
        `${BASE_URL}/stripe/connected-account`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (res.status == 201) {
        toast.success("Bank account added succesfully");
        setIsBankAccountAdded(false);
        fetchUserProfile();
      }
      console.log("add bank accont res >>>>", res);
    } catch (error) {
      console.log("error while adding bank account >>>>>>", error);
      toast.error(error.response.data.message);
    } finally {
      setAddingAccount(false);
    }
  };

  return (
    <div className="w-full px-5">
      <h2 className="font-bold text-[28px] blue-text">Payment</h2>

      <div className="w-full border mt-5 mb-4" />
      {userProfile && userProfile?.stripeCustomer?.id == null ? (
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-start gap-5"
        >
          <div className="w-full flex flex-col items-start gap-1">
            <label htmlFor="cardHolderName" className="text-[13px] font-medium">
              Card Holder Name
            </label>
            <input
              type="text"
              placeholder="John Smith"
              className="border rounded-2xl px-4 py-2.5 outline-none w-full text-sm"
            />
          </div>
          <div className="w-full flex flex-col items-start gap-1">
            <label htmlFor="cardNumber" className="text-[13px] font-medium">
              Card Number
            </label>
            <input
              type="text"
              placeholder="0000 0000 0000"
              className="border rounded-2xl px-4 py-2.5 outline-none w-full text-sm"
            />
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="w-full flex flex-col items-start gap-1">
              <label htmlFor="expiry" className="text-[13px] font-medium">
                Expiry
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                className="border rounded-2xl px-4 py-2.5 outline-none w-full text-sm"
              />
            </div>
            <div className="w-full flex flex-col items-start gap-1">
              <label htmlFor="cvc" className="text-[13px] font-medium">
                CVC
              </label>
              <input
                type="text"
                placeholder="0000"
                className="border rounded-2xl px-4 py-2.5 outline-none w-full text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="text-base font-bold py-3 w-full text-white blue-bg rounded-2xl"
          >
            Add
          </button>
        </form>
      ) : (
        <>
          {userProfile && userProfile?.stripeCustomer?.id !== null && (
            <button
              type="button"
              disabled={userProfile?.stripeCustomer?.id == null}
              onClick={handleOpenForm}
              className="mt-4 flex items-center justify-between custom-shadow py-4 px-5 rounded-2xl w-full"
            >
              <div className="flex items-center gap-2">
                <img
                  src="/credit-card-icon.png"
                  alt="credit-card-icon"
                  className="w-5 h-5"
                />
                <span className="text-sm text-[#5C5C5C]">
                  {userProfile?.stripeCustomer?.id === null ||
                  userProfile?.stripeCustomer?.id === undefined
                    ? "Add Debit/ Credit Card"
                    : `**** **** **** ${userProfile?.stripeCustomer?.paymentMethod?.last4}`}
                </span>
              </div>
              <MdOutlineKeyboardArrowRight className="light-blue-text text-2xl" />
            </button>
          )}
        </>
      )}
      {isCardAdded && (
        <button
          type="button"
          onClick={handleOpenForm}
          className="mt-4 flex items-center justify-between custom-shadow py-4 px-5 rounded-2xl w-full"
        >
          <div className="flex items-center gap-2">
            <img
              src="/mastercard-icon.png"
              alt="mastercard-icon"
              className="w-[24.79px] h-[15.33px]"
            />
            <span className="text-sm text-[#5C5C5C]">**** **** **** 8941</span>
          </div>
          <MdOutlineKeyboardArrowRight className="light-blue-text text-2xl" />
        </button>
      )}

      {userProfile && userProfile?.stripeConnectedAccount?.id == null ? (
        <form
          onSubmit={handleAddbankAccount}
          className="w-full flex flex-col items-start gap-5 mt-10"
        >
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="w-full flex flex-col items-start gap-1">
              <label
                htmlFor="accountNumber"
                className="text-[13px] font-medium"
              >
                Account Number
              </label>
              <input
                type="text"
                id="accountNumber"
                placeholder="John Smith"
                className="border rounded-2xl px-4 py-2.5 outline-none w-full text-sm"
                value={bankDetails.accountNumber}
                onChange={handleBankDetailsChange}
              />
            </div>
            <div className="w-full flex flex-col items-start gap-1">
              <label
                htmlFor="routingNumber"
                className="text-[13px] font-medium"
              >
                Routing Number
              </label>
              <input
                type="text"
                id="routingNumber"
                placeholder="Routing Number"
                className="border rounded-2xl px-4 py-2.5 outline-none w-full text-sm"
                value={bankDetails.routingNumber}
                onChange={handleBankDetailsChange}
              />
            </div>
          </div>

          <div className="w-full">
            <label htmlFor="expiry" className="text-[13px] font-medium mb-2">
              Date of Birth
            </label>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="w-full flex flex-col items-start gap-1">
                <input
                  type="text"
                  id="day"
                  placeholder="Day"
                  className="border rounded-2xl px-4 py-2.5 outline-none w-full text-sm"
                  value={dateOfBirth.day}
                  onChange={handleDateOfBirthChange}
                />
              </div>
              <div className="w-full flex flex-col items-start gap-1">
                <input
                  type="text"
                  id="month"
                  placeholder="Month"
                  className="border rounded-2xl px-4 py-2.5 outline-none w-full text-sm"
                  value={dateOfBirth.month}
                  onChange={handleDateOfBirthChange}
                />
              </div>
              <div className="w-full flex flex-col items-start gap-1">
                <input
                  type="text"
                  id="year"
                  placeholder="Year"
                  className="border rounded-2xl px-4 py-2.5 outline-none w-full text-sm"
                  value={dateOfBirth.year}
                  onChange={handleDateOfBirthChange}
                />
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col items-start gap-1">
            <label htmlFor="ssn" className="text-[13px] font-medium">
              Social Security Number (SSN)
            </label>
            <input
              type="text"
              id="ssn"
              placeholder="SSN"
              className="border rounded-2xl px-4 py-2.5 outline-none w-full text-sm"
              value={ssn}
              onChange={(e) => setSsn(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="text-base font-bold py-3 w-full text-white blue-bg rounded-2xl"
          >
            {addingAccount ? "Adding..." : "Add"}
          </button>
        </form>
      ) : (
        <button
          type="button"
          disabled={userProfile?.stripeConnectedAccount?.id == null}
          onClick={() => setIsBankAccountAdded(!isBankAccountAdded)}
          className="mt-4 flex items-center justify-between custom-shadow py-4 px-5 rounded-2xl w-full"
        >
          <div className="flex items-center gap-2">
            <img src="/bank.png" alt="bank" className="w-5 h-5" />
            <span className="text-sm text-[#5C5C5C]">
              **** **** ****{" "}
              {userProfile?.stripeConnectedAccount?.external_account?.last4}
            </span>
          </div>
          <MdOutlineKeyboardArrowRight className="light-blue-text text-2xl" />
        </button>
      )}
    </div>
  );
};

export default SettingsPayementPage;
