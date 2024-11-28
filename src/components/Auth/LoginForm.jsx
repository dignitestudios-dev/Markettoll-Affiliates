import React, { useContext, useState } from "react";
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import GoogleLoginButton from "./GoogleLoginButton";
import FacebookLoginButton from "./FacebookLoginButton";
import AppleLoginButton from "./AppleLoginButton";
import { toast } from "react-toastify";

const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.lenght < 8) {
    errors.password = "Password must be 8 characters";
  }

  return errors;
};

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${BASE_URL}/users/email-password-login`,
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("login response >>>>", response);
        if (response.data.success) {
          console.log("Login successful:", response.data);
          setTimeout(() => {
            localStorage.setItem("user", JSON.stringify(response.data.data));
            console.log("Cookie after setting:", Cookies.get("user"));
            resetForm();
          }, 500);
          toast.success("Login successfull");
          navigate("/");
          return response.data;
        } else {
          console.error("Login failed:", response.data.message);
          throw new Error(response.data.message);
        }
      } catch (error) {
        // console.error("Error logging in:", error);
        toast.error(error.response.data.message);
        setError(error.response.data.message);
        throw new Error(error.message);
      } finally {
        setLoading(false);
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
        className="min-h-[90vh] w-full lg:w-1/2 rounded-[30px] bg-[#FFFFFFA6] p-4 md:p-8 xl:p-12 flex flex-col items-start justify-center gap-4"
      >
        <h2 className={`blue-text text-[36px] font-bold`}>
          Welcome To Markettoll!
        </h2>
        <p className="text-base font-medium">
          Where every need finds its perfect match
        </p>
        {error !== "" && (
          <p className="text-base font-medium text-center mx-auto text-red-500">
            {error}
          </p>
        )}

        <div className="w-full flex flex-col items-start gap-1">
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
              className="w-full bg-white text-[14px] font-[400] text-[#5C5C5C] outline-none"
            />
          </div>
          {formik.errors.email ? (
            <div className="text-xs text-red-500">{formik.errors.email}</div>
          ) : null}
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

        <div className="text-end w-full">
          <Link
            to="/forgot-password"
            className="text-[14px] font-medium text-end"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="blue-bg text-white rounded-[20px] text-base font-bold py-3.5 w-full"
        >
          Log In
        </button>

        <p className="text-center text-xs text-[#8B8B8B] mx-auto mt-2">OR</p>

        <div className="w-full flex items-center justify-between">
          <GoogleLoginButton />
          <AppleLoginButton />
          <FacebookLoginButton />
        </div>

        <p className="text-sm text-center w-full mt-4">
          <span>Don't Have An Account? </span>
          <Link to="/sign-up" className="light-blue-text font-bold">
            Create One
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
