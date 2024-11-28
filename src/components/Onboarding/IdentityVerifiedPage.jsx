import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { useNavigate } from "react-router-dom";

const IdentityVerifiedPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log(user);
  const verifyIdentity = async () => {
    try {
      const res = await axios.put(
        `${BASE_URL}/users/identity-verified`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      // Handle response here
      console.log("Identity Verified:", res.data);
      if (res.data.success) {
        setTimeout(() => {
          navigate("/subscriptions");
        }, 1000);
      }
    } catch (error) {
      console.error("Error verifying identity:", error);
      // Optionally handle errors (e.g., show an alert to the user)
    }
  };

  useEffect(() => {
    verifyIdentity();
  }, []);
  return (
    <div className="w-full padding-x py-6">
      <div
        className={`w-full min-h-screen relative flex items-center justify-end p-4 md:p-10`}
        style={{
          backgroundImage: `url('/signup-mockup.png')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          borderRadius: "30px",
        }}
      >
        <div className="min-h-[742px] w-full lg:w-1/2 rounded-[30px] bg-[#FFFFFFA6] p-4 md:p-8 flex flex-col items-center justify-center gap-3">
          <img
            src="/password-update.png"
            alt="password-update"
            className="w-[79.1px] h-[83px]"
          />
          <h2 className={`blue-text text-[36px] font-bold`}>
            Account Verified
          </h2>
          <p className="text-base font-medium">
            Your password has been Verified successfully!
          </p>
        </div>
      </div>
    </div>
  );
};

export default IdentityVerifiedPage;
