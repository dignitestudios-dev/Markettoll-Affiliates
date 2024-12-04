import React from "react";
import { Link } from "react-router-dom";
import { FaRegCircle } from "react-icons/fa6";

const OptinFlowPage = () => {
  return (
    <div className="w-full padding-x py-10">
      <div className="w-full flex flex-col items-start gap-4">
        <h2 className="blue-text font-bold text-xl">
          Markettollls Opt-in Process
        </h2>
        <p>
          Our app's opt-in process ensures secure user authentication by
          incorporating Two-Factor Authentication (2FA). During sign-up, users
          explicitly give consent to receive messages for 2FA purposes on their
          phone number. This is achieved through a clear and transparent flow
          with a combination of consent collection, verification steps, and
          confirmation screens. If users require more information, they can
          access our detailed{" "}
          <Link to="/privacy-policy" className="light-blue-text font-semibold">
            Privacy Policy
          </Link>{" "}
          to understand how their data is handled. Below is an overview of the
          workflow and individual screens:
        </p>

        <div className="w-full">
          <span className="font-semibold">1. Splash Screen</span>
          <p className="flex items-center gap-1 lg:px-5 my-2">
            <span>
              <FaRegCircle className="text-xs text-gray-400" />
            </span>
            The first screen introduces users to the app with branding and a
            welcoming interface, signaling the start of the sign-up process.
          </p>
          <div className="w-full lg:px-4">
            <img
              src="/splash-screen.png"
              alt="splash-screen"
              className="object-contain h-[320px] mt-2"
            />
          </div>
        </div>

        <div className="w-full flex flex-col items-start gap-2 mt-5">
          <span className="font-semibold">2. Sign-Up Screen</span>
          <p className="flex items-center gap-1 lg:px-5">
            <span>
              <FaRegCircle className="text-xs text-gray-400" />
            </span>
            Users enter their name, email, phone number, and password.
          </p>
          <p className="flex items-center gap-1 lg:px-5">
            <span>
              <FaRegCircle className="text-xs text-gray-400" />
            </span>
            A checkbox with the text:
          </p>
          <p className="flex items-center gap-1 lg:px-5 font-semibold">
            <span>
              <FaRegCircle className="text-sm text-gray-400 invisible" />
            </span>
            "I agree to the Terms of Service and Privacy Policy and authorize
            the collection and use of my phone number for Two-Factor
            Authentication."
          </p>
          <p className="flex items-center gap-1 lg:px-5">
            <span>
              <FaRegCircle className="text-xs text-gray-400" />
            </span>
            Users must check this box to proceed, ensuring clear opt-in consent
            for 2FA.
          </p>
          <div className="w-full lg:px-4">
            <img
              src="/signup-screen.png"
              alt="splash-screen"
              className="object-contain h-[320px] mt-2"
            />
          </div>
        </div>

        <div className="w-full flex flex-col items-start gap-2 mt-5">
          <span className="font-semibold">
            3. Verify Email and Phone Number Screen (Initial)
          </span>
          <p className="flex items-center gap-1 lg:px-5">
            <span>
              <FaRegCircle className="text-xs text-gray-400" />
            </span>
            This screen shows both email and phone number awaiting verification.
            Users are prompted to verify each individually.
          </p>
          <div className="w-full lg:px-4">
            <img
              src="/verification-screen.png"
              alt="splash-screen"
              className="object-contain h-[320px] mt-2"
            />
          </div>
        </div>

        <div className="w-full flex flex-col items-start gap-2 mt-5">
          <span className="font-semibold">
            4. Verification Code Entry Screen (Email)
          </span>
          <p className="flex items-center gap-1 lg:px-5">
            <span>
              <FaRegCircle className="text-xs text-gray-400" />
            </span>
            Users enter the code sent to their email to verify it. This ensures
            their email address is valid and accessible.
          </p>
          <div className="w-full lg:px-4 flex items-center gap-5">
            <img
              src="/email-verification-screen-1.png"
              alt="splash-screen"
              className="object-contain h-[320px] mt-2"
            />
            <img
              src="/email-verification-screen-2.png"
              alt="splash-screen"
              className="object-contain h-[320px] mt-2"
            />
          </div>
        </div>

        <div className="w-full flex flex-col items-start gap-2 mt-5">
          <span className="font-semibold">
            5. Verify Email and Phone Number Screen (Email Verified)
          </span>
          <p className="flex items-center gap-1 lg:px-5">
            <span>
              <FaRegCircle className="text-xs text-gray-400" />
            </span>
            After email verification, this screen updates to reflect that the
            email is verified, while the phone number remains pending.
          </p>
          <div className="w-full lg:px-4 flex items-center gap-5">
            <img
              src="/verification-screen-2.png"
              alt="splash-screen"
              className="object-contain h-[320px] mt-2"
            />
          </div>
        </div>

        <div className="w-full flex flex-col items-start gap-2 mt-5">
          <span className="font-semibold">
            6. Verification Code Entry Screen (Phone Number)
          </span>
          <p className="flex items-center gap-1 lg:px-5">
            <span>
              <FaRegCircle className="text-xs text-gray-400" />
            </span>
            Users enter the code sent via SMS to their phone number to verify
            it. This step confirms the phone number is valid and operational for
            2FA.
          </p>
          <div className="w-full lg:px-4 flex items-center gap-5">
            <img
              src="/phone-otp-verification-screen-1.png"
              alt="splash-screen"
              className="object-contain h-[320px] mt-2"
            />
            <img
              src="/phone-otp-verification-screen-2.png"
              alt="splash-screen"
              className="object-contain h-[320px] mt-2"
            />
          </div>
        </div>

        <div className="w-full flex flex-col items-start gap-2 mt-5">
          <span className="font-semibold">
            7. Verify Email and Phone Number Screen (Both Verified)
          </span>
          <p className="flex items-center gap-1 lg:px-5">
            <span>
              <FaRegCircle className="text-xs text-gray-400" />
            </span>
            The final verification screen displays both email and phone number
            as successfully verified. This ensures users have completed the 2FA
            setup process.
          </p>
          <div className="w-full lg:px-4 flex items-center gap-5">
            <img
              src="/accounts-verified-screen.png"
              alt="splash-screen"
              className="object-contain h-[320px] mt-2"
            />
          </div>
        </div>

        <div className="w-full flex flex-col items-start gap-2 mt-5">
          <h3 className="font-semibold">
            How Consent is Collected and 2FA is Implemented
          </h3>
          <ul className="list-disc lg:px-4">
            <li>
              During the sign-up process, the user is explicitly informed about
              the collection and use of their phone number for 2FA. Consent is
              obtained via a mandatory checkbox with clear language.
            </li>
            <li>
              Verification ensures that the provided contact details are
              accurate and accessible.
            </li>
            <li>
              2FA works by sending unique codes to the verified email and phone
              number, which the user must enter to complete the verification
              process, adding an essential layer of security.
            </li>
            <li>
              For further details, users can review our{" "}
              <Link
                to="/privacy-policy"
                className="light-blue-text font-semibold"
              >
                Privacy Policy
              </Link>
              , which provides comprehensive information on data collection and
              usage practices.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OptinFlowPage;
