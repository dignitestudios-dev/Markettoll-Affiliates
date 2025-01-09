import React, { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  app,
  auth,
  googleProvider,
  appleProvider,
} from "../../firebase/firebase";
import Cookies from "js-cookie";
import { FaFacebookF } from "react-icons/fa";
import {
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { toast } from "react-toastify";

const SocialLogin = () => {
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);

  const handleFacebookLogin = async () => {
    try {
      setFacebookLoading(true);
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("facebook login result >>>", result);
      if (result) {
        const token = await result?.user?.getIdToken();
        if (token) {
          try {
            const email = result?.user?.email;
            let res = await fetch("https://api.ipify.org?format=json", {
              method: "GET",
            });
            const ip = await res.json();
            const response = await axios.post(
              `${BASE_URL}/users/facebook-login`,
              {
                email: email,
                name: result?.user?.displayName,
                facebookAuthId: result?.user?.uid,
                profileImage: result?.user?.photoURL,
                idToken: token,
                ip: ip?.ip,
              }
            );

            if (response?.data?.success) {
              Cookies.set("user", response?.data?.data);
              localStorage.setItem(
                "user",
                JSON.stringify(response?.data?.data)
              );

              navigate("/add-phone-number");
            }
          } catch (error) {
            setFacebookLoading(false);
            // ErrorToast(error.response.data.message || "Something went wrong.");
          } finally {
            setFacebookLoading(false);
          }
        }
      }
    } catch (err) {
      console.log(err);
      // ErrorToast("Cannot open facebook signin modal.");
    } finally {
      setFacebookLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setAppleLoading(true);
      const result = await signInWithPopup(auth, appleProvider);
      const credential = OAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // console.log("apple result >>>", result);
      if (result) {
        const token = await result?.user?.getIdToken();
        if (token) {
          try {
            const email = result?.user?.email;
            let res = await fetch("https://api.ipify.org?format=json", {
              method: "GET",
            });
            const ip = await res.json();
            const response = await axios.post(`${BASE_URL}/users/apple-login`, {
              email: email,
              name: result?.user?.displayName,
              appleAuthId: result?.user?.uid,
              profileImage: result?.user?.photoURL || "",
              idToken: token,
              ip: ip?.ip,
            });

            if (response?.data?.success) {
              Cookies.set("token", response?.data?.token);
              localStorage.setItem(
                "user",
                JSON.stringify(response?.data?.data)
              );
              navigate("/add-phone-number");
            }
          } catch (error) {
            setAppleLoading(false);
            console.log(error);
            toast.error("Something went wrong");
            // ErrorToast(error.response.data.message || "Something went wrong.");
          } finally {
            setAppleLoading(false);
          }
        }
      }
    } catch (err) {
      console.log(err);

      setAppleLoading(false);

      // ErrorToast("Cannot open apple signin modal.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      if (result) {
        const token = await result?.user?.getIdToken();
        if (token) {
          try {
            try {
              const res = await axios.post(`${BASE_URL}/users/google-login`, {
                name: result?.user?.displayName,
                email: result?.user?.email,
                googleAuthId: result?.user?.uid,
                profileImage: result?.user?.photoURL,
              });
              console.log("google login res >>>", res?.data?.data);
              if (res?.status == 200) {
                Cookies.set("user", JSON.stringify(res?.data?.data));
                localStorage.setItem("user", JSON.stringify(res?.data?.data));
                navigate("/add-phone-number");
              }
            } catch (error) {
              console.log("error while google login >>>>", error);
              toast.err(error?.response?.data?.message);
            }
          } catch (error) {
            console.log(error);
            setGoogleLoading(false);
          } finally {
            setGoogleLoading(false);
          }
        }
      }
    } catch (err) {
      setGoogleLoading(false);
      console.log(err);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div class="w-full grid grid-cols-1 lg:grid-cols-3 gap-3">
      <button
        type="button"
        onClick={handleGoogleLogin}
        aria-label="Sign in with Google"
        className="flex items-center justify-center w-full h-12 bg-[#FFFFFF80] border hover:bg-gray-50 border-button-border-light rounded-full p-1 pr-3"
      >
        {googleLoading ? (
          <div
            className="animate-spin inline-block size-4 border-[3px] mr-1 border-current border-t-transparent text-[#EA4335] rounded-lg"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center  w-9 h-9 rounded-l">
            <img src={'/google-icon.png'} className="w-[22px] h-[22px] " alt="" />
          </div>
        )}
        {/* <span className="text-xs text-google-text-gray tracking-wider">
        
        </span> */}
      </button>
      <button
        type="button"
        onClick={handleAppleLogin}
        aria-label="Sign in with Google"
        className="flex items-center w-full justify-center h-12 bg-[#FFFFFF80] border hover:bg-gray-50 border-button-border-light rounded-full p-1 pr-3"
      >
        {appleLoading ? (
          <div
            className="animate-spin inline-block size-4 border-[3px] mr-1 border-current border-t-transparent text-[#000] rounded-lg"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <div className="flex items-center text-gray-800 justify-center bg-[#FFFFFF80] w-9 h-9 rounded-full">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 384 512"
              class="text-xl"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
            </svg>
          </div>
        )}

        {/* <span className="text-xs text-google-text-gray tracking-wider">
          Continue with Apple
        </span> */}
      </button>
      <button
        type="button"
        onClick={handleFacebookLogin}
        aria-label="Sign in with Facebook"
        className="flex items-center justify-center h-12 bg-[#FFFFFF80] border hover:bg-gray-50 border-button-border-light rounded-full p-1 pr-3"
      >
        {facebookLoading ? (
          <div
            className="animate-spin inline-block size-4 border-[3px] mr-1 border-current border-t-transparent text-[#1877F2] rounded-lg"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center bg-[#FFFFFF80] w-9 h-9 rounded-full">
            <FaFacebookF className="text-xl text-[#1877F2]" />
          </div>
        )}
        {/* <span className="text-xs text-google-text-gray tracking-wider">
          Sign in with Facebook
        </span> */}
      </button>
    </div>
  );
};

export default SocialLogin;
