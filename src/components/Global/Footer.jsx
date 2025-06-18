import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
// eoifne

const Footer = () => {
  return (
    <footer className="padding-x w-full py-12 blue-bg text-white mt-12">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 gap-y-6">
        <div className="flex items-center justify-center lg:justify-start gap-4">
          {/* <img
            src="/call-icon-white.png"
            alt="call-icon"
            className="w-[20px] h-[20px]"
          />
          <Link
            to={"tel:contact@markettoll.com"}
            className="font-medium text-[20px]"
          >
            1 (833) 770-2446
          </Link> */}

          <Link
            to="/terms-and-conditions"
            className="text-white underline text-sm"
          >
            Terms & Conditions
          </Link>
          <Link to="/privacy-policy" className="text-white underline text-sm">
            Privacy Policy
          </Link>
            <Link to="/sign-up" className="text-white underline text-sm" state={{ role: "influencer" }}>
              Become an Affiliate
            </Link>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <img
            src="/logo-white.png"
            alt="logo"
            className="w-[112px] h-[87px]"
          />
          <div className="flex items-center justify-center gap-2">
            <img
              src="/email-white-icon.png"
              alt="message-icon"
              className="w-[16.67px] h-[15px]"
            />
            <Link
              to={"mailto:info@markettoll.com"}
              className="font-medium text-[20px]"
            >
              info@markettoll.com
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center lg:justify-end gap-5">
          <Link target="_blank" to="http://www.facebook.com">
            <FaFacebook className="text-white w-[24px] h-[24px]" />
          </Link>
          <Link target="_blank" to="http://www.twitter.com">
            <FaXTwitter className="text-white w-[24px] h-[24px]" />
          </Link>
          <Link target="_blank" to="http://www.instagram.com">
            <FaInstagram className="text-white w-[24px] h-[24px]" />
          </Link>
          <Link target="_blank" to="http://www.linkedin.com">
            <FaLinkedin className="text-white w-[24px] h-[24px]" />
          </Link>
        </div>
      </div>
      <div className="mt-10 text-center">
        <p className="relative mb-2">
          Copyright &#169; 2024 All rights reserved.
        </p>

        {/* <div className="flex items-center justify-center gap-x-4">
          <Link to="/privacy-policy" className="text-white underline text-sm">
            Privacy Policy
          </Link>
          <Link
            to="/terms-and-conditions"
            className="text-white underline text-sm"
          >
            Terms & Conditions
          </Link>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
