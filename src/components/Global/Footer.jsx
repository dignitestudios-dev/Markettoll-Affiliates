import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="padding-x w-full py-12 bg-[#F7F7F7] mt-12">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 gap-y-6">
        <div className="flex items-center justify-center lg:justify-start gap-2">
          <img
            src="/call-icon.png"
            alt="call-icon"
            className="w-[20px] h-[20px]"
          />
          <Link
            to={"tel:contact@markettoll.com"}
            className="font-medium text-[20px]"
          >
            10 (87) 738-3940
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <img
            src="/markettol-logo.png"
            alt="logo"
            className="w-[111px] h-[111px]"
          />
          <div className="flex items-center justify-center gap-2">
            <img
              src="/message-icon.png"
              alt="message-icon"
              className="w-[20px] h-[20px]"
            />
            <Link
              to={"mailto:contact@markettoll.com"}
              className="font-medium text-[20px]"
            >
              contact@markettoll.com
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center lg:justify-end gap-2">
          <Link target="_blank" to="http://www.facebook.com">
            <FaFacebook className="light-blue-text w-[24px] h-[24px]" />
          </Link>
          <Link target="_blank" to="http://www.twitter.com">
            <FaXTwitter className="light-blue-text w-[24px] h-[24px]" />
          </Link>
          <Link target="_blank" to="http://www.instagram.com">
            <FaInstagram className="light-blue-text w-[24px] h-[24px]" />
          </Link>
          <Link target="_blank" to="http://www.linkedin.com">
            <FaLinkedin className="light-blue-text w-[24px] h-[24px]" />
          </Link>
        </div>
      </div>
      <div className="mt-10 text-center">
        <p>
          Copyright 2024 All rights reserved | This is made by{" "}
          <Link
            to="https://www.dignitestudios.com"
            className="light-blue-text font-medium"
          >
            Dignite Studios
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
