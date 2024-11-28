import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UpdatePasswordForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/login");
    }, 1500);

    return () => {};
  }, []);

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
      <div className="min-h-[90vh] w-full lg:w-1/2 rounded-[30px] bg-[#FFFFFFA6] p-4 md:p-8 flex flex-col items-center justify-center gap-4 relative text-center">
        <img
          src="/password-update.png"
          alt="password-update"
          className="w-[79.1px] h-[83.59px]"
        />
        <h2 className={`blue-text text-[36px] font-bold`}>Password Updated!</h2>
        <p className="text-base font-medium lg:w-[80%]">
          Your password has been updated successfully!
        </p>
      </div>
    </div>
  );
};

export default UpdatePasswordForm;
