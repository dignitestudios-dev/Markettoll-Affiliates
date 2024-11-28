import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import Cookies from "js-cookie";

const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  return errors;
};

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate,
    onSubmit: async (values, { resetForm }) => {
      // alert(JSON.stringify(values, null, 2));
      try {
        const res = await axios.post(
          `${BASE_URL}/users/forgot-password-send-email-otp`,
          { email: values.email }
        );
        console.log("verify email res >>>>>>", res);
        Cookies.set("user-email", JSON.stringify(values.email));
        navigate("/verify-otp", {
          state: { from: "forgot-password", type: "forgot-password" },
        });
      } catch (error) {
        console.log("Verify email err >>>>", error);
      }
      resetForm();
    },
  });
  return (
    <div
      className={`w-full min-h-screen relative flex items-center justify-end p-4 md:p-10`}
      style={{
        backgroundImage: `url('/signup-mockup.png')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        borderRadius: "30px",
      }}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="min-h-[90vh] w-full lg:w-1/2 rounded-[30px] bg-[#FFFFFFA6] p-4 md:p-8 flex flex-col items-start justify-center gap-2 relative"
      >
        <Link to="/login" className="absolute top-5 left-4 md:left-8">
          <img
            src="/left-arrow-icon.png"
            alt="left arrow icon"
            className="w-[35px]"
          />
        </Link>
        <h2 className={`blue-text text-[36px] font-bold`}>Forgot Password?</h2>
        <p className="text-base font-medium lg:w-[80%]">
          Enter your email to reset your password and swiftly resume your
          experience.
        </p>

        <div className="w-full flex flex-col items-start gap-1 mt-3">
          <label htmlFor="email" className="text-[14px] font-medium">
            Email
          </label>
          <div className="bg-[#fff] rounded-[20px] w-full flex items-center justify-start gap-3 p-4">
            <img
              src="/mail-icon.png"
              alt="mail-icon.png"
              className="w-[17.95px] h-[15.34px]"
            />
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="johnsmith@gmail.com"
              className="w-full bg-transparent text-[14px] font-[400] text-[#5C5C5C] outline-none"
            />
          </div>
          {formik.errors.email ? (
            <div className="text-xs text-red-500">{formik.errors.email}</div>
          ) : null}
        </div>

        <button
          type="submit"
          className="blue-bg text-white rounded-[20px] text-base font-bold py-3.5 w-full mt-5"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
