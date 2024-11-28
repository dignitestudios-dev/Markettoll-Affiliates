import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { FaArrowLeftLong } from "react-icons/fa6";
import { LuEye, LuEyeOff } from "react-icons/lu";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const validate = (values) => {
  const errors = {};

  if (!values.password) {
    errors.password = "Required";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Required";
  }

  return errors;
};

const UpdatePasswordForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate,
    onSubmit: async (values, { resetForm }) => {
      alert(JSON.stringify(values, null, 2));
      const userEmail = JSON.parse(Cookies.get("user-email"));
      try {
        const res = await axios.put(
          `${BASE_URL}/users/forgot-password-update-password`,
          { password: values.password, email: userEmail }
        );
        // resetForm();
        navigate("/password-updated");
        console.log("Password update api res >>>>>", res);
      } catch (error) {
        console.log("password update error >>>>", error);
      }
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
        className="min-h-[90vh] w-full lg:w-1/2 rounded-[30px] bg-[#FFFFFFA6] p-4 md:p-8 flex flex-col items-start justify-center gap-0 relative"
      >
        <Link to="/forgot-password" className="absolute top-5 left-4 md:left-8">
          <img
            src="/left-arrow-icon.png"
            alt="left arrow icon"
            className="w-[35px]"
          />
        </Link>
        <h2 className={`blue-text text-[36px] font-bold`}>Update Password</h2>
        <p className="text-base font-medium lg:w-[80%] lg:leading-[19.41px]">
          Please enter the code that we sent to your email johnsmith@gmail.com
          to reset your password.
        </p>

        <div className="flex items-center gap-3 my-5">
          <img
            src="/profile-pic.png"
            alt="profile-pic"
            className="block w-[84px] h-[84px]"
          />
          <div className="flex flex-col">
            <h3 className="text-[18px] font-bold">John Smith</h3>
            <h3 className="text-[16px] font-normal text-[#606060]">
              johnsmith@gmail.com
            </h3>
          </div>
        </div>

        <div className="w-full flex flex-col items-start gap-1">
          <label htmlFor="phone" className="text-[14px] font-medium">
            Password
          </label>

          <div className="bg-[#fff] rounded-[20px] w-full flex items-center justify-start gap-3 p-4">
            <img
              src="/password-icon.png"
              alt="password-icon"
              className="w-[18px] h-[18px]"
            />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              placeholder="Enter Password"
              className="w-full bg-transparent text-[14px] font-[400] text-[#5C5C5C] outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <LuEye className="text-[#606060]" />
              ) : (
                <LuEyeOff className="text-[#606060]" />
              )}
            </button>
          </div>
          {formik.errors.password ? (
            <div className="text-xs text-red-500">{formik.errors.password}</div>
          ) : null}
        </div>

        <div className="w-full flex flex-col items-start gap-1 my-4">
          <label htmlFor="confirmPassword" className="text-[14px] font-medium">
            Confirm Password
          </label>

          <div className="bg-[#fff] rounded-[20px] w-full flex items-center justify-start gap-3 p-4">
            <img
              src="/password-icon.png"
              alt="password-icon"
              className="w-[18px] h-[18px]"
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              placeholder="Enter Password"
              className="w-full bg-transparent text-[14px] font-[400] text-[#5C5C5C] outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showPassword ? (
                <LuEye className="text-[#606060]" />
              ) : (
                <LuEyeOff className="text-[#606060]" />
              )}
            </button>
          </div>
          {formik.errors.confirmPassword ? (
            <div className="text-xs text-red-500">
              {formik.errors.confirmPassword}
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          className="blue-bg text-white rounded-[20px] text-base font-bold py-3.5 w-full mt-4"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdatePasswordForm;
