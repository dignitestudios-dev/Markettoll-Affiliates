import { useFormik } from "formik";
import React, { useContext, useState } from "react";
import ButtonLoader from "../../components/Global/ButtonLoader";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/api";
import axios from "axios";

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

const AddBankAccountForm = ({ setIsBankAccountAdded }) => {
  const [loading, setLoading] = useState(false);
  const { fetchUserProfile, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location?.pathname);

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
        console.log("bank account added >>>>", res);
        if (res.status == 201) {
          toast.success("Bank account added succesfully");
          setIsBankAccountAdded(false);
          fetchUserProfile();
          navigate(-1);
        }
      } catch (error) {
        console.log("error while adding bank account >>>>>>", error);
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full flex flex-col items-start gap-5 mt-10"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="w-full flex flex-col items-start gap-1">
          <label htmlFor="accountNumber" className="text-[13px] font-medium">
            Account Number
          </label>
          <input
            type="text"
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
          <label htmlFor="routingNumber" className="text-[13px] font-medium">
            Routing Number
          </label>
          <input
            type="text"
            id="routingNumber"
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
  );
};

export default AddBankAccountForm;
