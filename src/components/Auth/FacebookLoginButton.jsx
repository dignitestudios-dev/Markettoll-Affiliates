import React from "react";
// import FacebookLogin from "react-facebook-login";

const FacebookLoginButton = () => {
  const handleResponse = (response) => {
    console.log("Facebook login success:", response);
    // Send `response.accessToken` to your backend for verification
  };

  const handleFailure = (error) => {
    console.error("Facebook login failed:", error);
  };
  return (
    <>
      <button
        type="button"
        className="bg-white w-[85px] xl:w-[166px] h-[50px] rounded-[20px] flex items-center justify-center"
      >
        <img
          src="/facebook-icon.png"
          alt="google icon"
          className="w-[22px] h-[22px]"
        />
      </button>
      {/* <FacebookLogin
        appId={process.env.REACT_APP_FACEBOOK_APP_ID}
        autoLoad={false}
        fields="name,email,picture"
        callback={handleResponse}
        onFailure={handleFailure}
      /> */}
    </>
  );
};

export default FacebookLoginButton;
