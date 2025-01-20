import axios from "axios";
import React, { useContext, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import AddBankAccountForm from "./AddBankAccountForm";
import { useFormik } from "formik";
import ButtonLoader from "../../components/Global/ButtonLoader";
import SettingsAddCard from "./SettingsAddCard";
import SettingsAddBankAccount from "./SettingsAddBankAccount";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51OsZBgRuyqVfnlHK0Z5w3pTL7ncHPcC75EwkxqQX9BAlmcXeKappekueIzmpWzWYK9L9HEGH3Y2Py2hC7KyVY0Al00przQczPf"
);

const validate = (values) => {
  const errors = {};
  if (!values.accountNumber) {
    errors.accountNumber = "Required";
  } else if (
    values.accountNumber.length > 12 ||
    values.accountNumber.length < 12
  ) {
    errors.accountNumber = "Account number must be 12 digits";
  }

  if (!values.routingNumber) {
    errors.routingNumber = "Required";
  } else if (
    values.routingNumber.length > 9 ||
    values.routingNumber.length < 9
  ) {
    errors.routingNumber = "Routing number must be 9 digits";
  }

  if (!values.day) {
    errors.day = "Required";
  } else if (values.day.length < 2 || values.day.length > 2) {
    errors.day = "Day must be 2 digits";
  }

  if (!values.month) {
    errors.month = "Required";
  } else if (values.month.length > 2 || values.month.length < 2) {
    errors.month = "Month must be 2 digits";
  }

  if (!values.year) {
    errors.year = "Required";
  } else if (values.year.length < 4 || values.year.length > 4) {
    errors.year = "Year must be 4 digits";
  }

  if (!values.ssn) {
    errors.ssn = "Required";
  } else if (values.ssn.length < 9 || values.ssn.length > 9) {
    errors.ssn = "SSN must be 9 digits";
  }

  return errors;
};

const SettingsPayementPage = () => {
  const { user, fetchUserProfile, userProfile } = useContext(AuthContext);
  const [openForm, setOpenForm] = useState(false);
  const [isCardAdded, setIsCardAdded] = useState(false);
  const [isBankAccountAdded, setIsBankAccountAdded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenForm = () => {
    setOpenForm(!openForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleOpenForm();
    setIsCardAdded(true);
  };

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      accountNumber: "",
      routingNumber: "",
      day: "",
      month: "",
      year: "",
      ssn: "",
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await axios.post(
          `${BASE_URL}/stripe/connected-account`,
          {
            bankDetails: {
              accountNumber: values.accountNumber,
              routingNumber: values.routingNumber,
            },
            dateOfBirth: {
              day: values.day,
              month: values.month,
              year: values.year,
            },
            idNumber: values.ssn,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        // console.log("bank account added >>>>", res);
        if (res.status == 201) {
          toast.success("Bank account added succesfully");
          setIsBankAccountAdded(false);
          fetchUserProfile();
          // navigate(-1);
          if (location?.state) {
            navigate(location?.state?.from);
          } else {
            navigate("/");
          }
        }
      } catch (error) {
        // console.log("error while adding bank account >>>>>>", error);
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Elements stripe={stripePromise}>
      <div className="w-full px-5">
        <h2 className="font-bold text-[28px] blue-text mb-5">Payment</h2>
        <div className="w-full border-[0.5px] border-gray-100 mb-5" />
        <SettingsAddCard />

        <SettingsAddBankAccount />

        {/* <div className="w-full border mt-5 mb-4" />
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
          onSubmit={formik.handleSubmit}
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
                maxLength={12}
                id="accountNumber"
                placeholder="John Smith"
                className="border rounded-2xl px-4 py-2.5 outline-none w-full text-sm"
                onChange={formik.handleChange}
                value={formik.values.accountNumber}
              />
              {formik.errors.accountNumber ? (
                <div className="text-xs text-red-600 font-medium">
                  {formik.errors.accountNumber}
                </div>
              ) : null}
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
                maxLength={9}
                placeholder="Routing Number"
                className="border rounded-2xl px-4 py-2.5 outline-none w-full text-sm"
                onChange={formik.handleChange}
                value={formik.values.routingNumber}
              />
              {formik.errors.routingNumber ? (
                <div className="text-xs text-red-600 font-medium">
                  {formik.errors.routingNumber}
                </div>
              ) : null}
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
                  maxLength={2}
                  placeholder="Day"
                  className="border rounded-2xl px-4 py-2.5 outline-none w-full text-sm"
                  onChange={formik.handleChange}
                  value={formik.values.day}
                />
                {formik.errors.day ? (
                  <div className="mt-1 text-xs text-red-600 font-medium">
                    {formik.errors.day}
                  </div>
                ) : null}
              </div>
              <div className="w-full flex flex-col items-start gap-1">
                <input
                  type="text"
                  id="month"
                  maxLength={2}
                  placeholder="Month"
                  className="border rounded-2xl px-4 py-2.5 outline-none w-full text-sm"
                  onChange={formik.handleChange}
                  value={formik.values.month}
                />
                {formik.errors.month ? (
                  <div className="mt-1 text-xs text-red-600 font-medium">
                    {formik.errors.month}
                  </div>
                ) : null}
              </div>
              <div className="w-full flex flex-col items-start gap-1">
                <input
                  type="text"
                  id="year"
                  maxLength={4}
                  placeholder="Year"
                  className="border rounded-2xl px-4 py-2.5 outline-none w-full text-sm"
                  onChange={formik.handleChange}
                  value={formik.values.year}
                />
                {formik.errors.year ? (
                  <div className="mt-1 text-xs text-red-600 font-medium">
                    {formik.errors.year}
                  </div>
                ) : null}
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
              maxLength={9}
              placeholder="SSN"
              className="border rounded-2xl px-4 py-2.5 outline-none w-full text-sm"
              onChange={formik.handleChange}
              value={formik.values.ssn}
            />
            {formik.errors.ssn ? (
              <div className="text-xs text-red-600 font-medium">
                {formik.errors.ssn}
              </div>
            ) : null}
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
      )} */}
      </div>{" "}
    </Elements>
  );
};

export default SettingsPayementPage;
