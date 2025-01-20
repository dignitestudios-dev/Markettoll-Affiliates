import React, { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { BASE_URL } from "../api/api";
import { db, doc, updateDoc } from "../firebase/firebase";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [hasBlocked, setHasBlocked] = useState(false);
  const [isBlockedByUser, setIsBlockedByUser] = useState(false);
  const [OnOF, setOnOF] = useState(false);
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
      setUserProfile(res?.data?.data);
    } catch (error) {
      // console.log("error while fetch user profile >>>", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setOnOF(false);
          // The tab is inactive, set the user as offline and record last seen time
          const userRef = doc(db, "status", user?._id);
          updateDoc(userRef, {
            isOnline: false,
            lastSeen: new Date(), // Set the last seen timestamp
          });
        } else {
          setOnOF(true);
          // console.log("on");
          // The tab is active, set the user as online
          const userRef = doc(db, "status", user?._id);
          updateDoc(userRef, {
            isOnline: true,
          });
        }
      };

      // Event listener for tab visibility change
      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Initial check on page load if the tab is visible
      if (!document.hidden) {
        setOnOF(false);
        const userRef = doc(db, "status", user?._id);
        updateDoc(userRef, {
          isOnline: true,
        });
      }

      // Cleanup the event listener when the component unmounts
      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }
  }, [user?._id]);

  return (
    <AuthContext.Provider
      value={{
        verificationStatus,
        setVerificationStatus,
        user,
        userProfile,
        setUserProfile,
        fetchUserProfile,
        hasBlocked,
        setIsBlockedByUser,
        isBlockedByUser,
        setHasBlocked,
        OnOF,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
