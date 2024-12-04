import React from "react";
import FacebookLogin from "react-facebook-login";
import { FaFacebook } from "react-icons/fa6";
import { toast } from "react-toastify";

const FacebookLoginButton = () => {
  const handleResponse = (response) => {
    if (response?.status === "unknown") {
      console.error("Sorry!", "Something went wrong with facebook Login.");
      toast.error("Sorry!", "Something went wrong with facebook Login.");
      return;
    }
    console.log(response);
    // console will print following object for you.
    //   {
    //     "name": "Syed M Ahmad",
    //     "email": "ssgcommando90@yahoo.com",
    //     "picture": {
    //         "data": {
    //             "height": 50,
    //             "is_silhouette": false,
    //             "url": "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=7138203302951151&height=50&width=50&ext=1714730459&hash=AfplSQ-UxV9LeHd5wYnaKbeKEIfUjMN-pHFGZJaWwC-00g",
    //             "width": 50
    //         }
    //     },
    //     "id": "7138203302951151",
    //     "userID": "7138203302951151",
    //     "expiresIn": 7142,
    //     "accessToken": "EAANdCvUejTUBO3C5uZCp0n6i9H31bCdW6bZBUcOET2aTbWlZCJA7kQoQ1jxDCsnFctxZBAQPl2kSUSqb4N6KDLM8wROXn4fZCBj1Pmgq5peKkmPv7YJWHKXLb9mOIwcBbJJGj5EaXwLURktOGSv7HeNsiGxZBPBr1jewzZAL7FxbITljSsBq6LYnhKO6xT9D5FbFZB1JWdjii63xAeU36wZDZD",
    //     "signedRequest": "r3tHehW5aounQcMzalAtmiHR_lCmRHy0GSmrlD4w3zM.eyJ1c2VyX2lkIjoiNzEzODIwMzMwMjk1MTE1MSIsImNvZGUiOiJBUURUaEItZ3Z6RjViN09yV3VyM2tOai1FdDNQM1NGSHpheWVsMEYxSXc1NTNlTHBoZUs3M2RtTENFbVZTVjgySEZlUUFCQ0dPR19zME94RjU4LS14MFYxUWZIYkhCdDFTVl9FNG1scnh6Y2Z5RTVFNVozUy03SllRWUI2MEh1bW15b19mN3FKc3pLZENSbWFBbkE2c3JXenBCYnRfLXZIVTZjRTNYSjZnN19Db2xXNjk0Z1JDODd5eVVjT2R4NEszMHY4LXdrVlpVQWNvMXBkZGR1eTVqbFN4Yld0RkhGVlNpS282OGZxc09YdndYSXlDR0NOTjJrZEhDUDJSZElkT3VmSmRhbGs0dEo1TTRFUU9nWXJ3QllkeVlyUlY1ZlRuS3RvdGJyMF9ROHpQT21PTzQ2eXNBZmtJdGdjblFjOG5VaHQ5U0RMRlAzRVBhS0Q0dV9mY0YwbyIsImFsZ29yaXRobSI6IkhNQUMtU0hBMjU2IiwiaXNzdWVkX2F0IjoxNzEyMTM4NDU4fQ",
    //     "graphDomain": "facebook",
    //     "data_access_expiration_time": 1719914458
    // }
  };

  const handleFailure = (error) => {
    console.error("Facebook login failed:", error);
  };
  return (
    <>
      {/* <button
        type="button"
        className="bg-white w-[85px] xl:w-[166px] h-[50px] rounded-[20px] flex items-center justify-center"
      >
        <img
          src="/facebook-icon.png"
          alt="google icon"
          className="w-[22px] h-[22px]"
        />
      </button> */}
      <FacebookLogin
        appId={"1555830952016505"}
        autoLoad={false}
        fields="name,email,picture"
        callback={handleResponse}
        onFailure={handleFailure}
        icon={<FaFacebook />}
        textButton=" "
      />
    </>
  );
};

export default FacebookLoginButton;
