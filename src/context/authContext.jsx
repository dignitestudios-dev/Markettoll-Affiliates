import React, { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "../api/api";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState({
    email: false,
    phone: false,
  });
  const userCookie = localStorage.getItem("user");
  const user = userCookie ? JSON.parse(userCookie) : null;

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      // console.log("user profile >>>", res?.data);
      setUserProfile(res?.data?.data);
    } catch (error) {
      // console.log("error while fetch user profile >>>", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        verificationStatus,
        setVerificationStatus,
        user,
        userProfile,
        setUserProfile,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
