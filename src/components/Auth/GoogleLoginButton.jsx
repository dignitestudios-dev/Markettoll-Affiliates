import React from "react";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = () => {
  const handleLoginSuccess = (response) => {
    console.log("Google login success:", response);
    // Send `response.credential` to your backend for verification
  };

  const handleLoginFailure = (error) => {
    console.error("Google login failed:", error);
  };

  return (
    <button
      type="button"
      className="bg-white w-[85px] xl:w-[166px] h-[50px] rounded-[20px] flex items-center justify-center"
    >
      <img
        src="/google-icon.png"
        alt="google icon"
        className="w-[22px] h-[22px]"
      />
    </button>
    // <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    //   <GoogleLogin
    //     onSuccess={handleLoginSuccess}
    //     onError={handleLoginFailure}
    //   />
    // </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
