import React, { useState } from "react";

const WelcomePopup = ({ closeModal, onclick }) => {
  const [state, setState] = useState(false);
  const [changeContent, setChangeContent] = useState(false);

  const handleToggleState = () => {
    setState(!state);
    setChangeContent(true);
  };

  return (
    closeModal && (
      <div className="w-full h-auto lg:h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center px-4">
        <div className="bg-white p-5 w-[100%] lg:w-[80%] rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <img
              src="/signup-mockup.png"
              alt="signup-mockup"
              className="w-full h-[250px] lg:h-[510px] object-cover rounded-[20px]"
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-3">
            <img
              src={state ? "/attention-icon.png" : "/smiling-emoji-icon.png"}
              alt="smiling-emoji-icon"
              className="w-[60px] lg:w-[101px] h-[60px] lg:h-[101px]"
            />
            <h2 className="blue-text font-bold text-[28px]">
              {state
                ? "Attention Buyers and Sellers!"
                : "Welcome to Marketoll!"}
            </h2>
            <p className="text-[#5C5C5C] text-base leading-[19.2px] w-[70%] text-center">
              {state
                ? "To safeguard against fraudulent activities, please be mindful of your personal information stored on our platform."
                : "  Elevate your buying and selling experience with us! Connect effortlessly, enjoy convenience."}
            </p>
            <button
              type="button"
              onClick={state ? onclick : handleToggleState}
              className="w-full lg:w-[389px] py-3 blue-bg font-bold text-base mt-6 text-white rounded-2xl text-center"
            >
              {state ? "Close" : "Next"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default WelcomePopup;
