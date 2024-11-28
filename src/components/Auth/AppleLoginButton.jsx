import React from "react";
import AppleSignin from "react-apple-signin-auth";

const AppleLoginButton = () => {
  const handleResponse = (response) => {
    console.log("Apple login success:", response);
    // Send `response.authorization.id_token` to your backend for verification
  };
  return (
    <>
      <button
        type="button"
        className="bg-white w-[85px] xl:w-[166px] h-[50px] rounded-[20px] flex items-center justify-center"
      >
        <img
          src="/apple-icon.png"
          alt="google icon"
          className="w-[18px] h-[22px]"
        />
      </button>

      {/* <AppleSignin
        authOptions={{
          clientId: "com.example.app", // Your App ID
          redirectURI: "https://your-redirect-uri.com",
          scope: "email name",
          state: "state",
          usePopup: true,
        }}
        onSuccess={handleResponse}
        onError={(error) => console.error("Apple login error:", error)}
      /> */}
    </>
  );
};

export default AppleLoginButton;
