import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = "MARKET TOLL - Privacy Policy";
  }, []);
  return (
    <div
      className={`w-full flex flex-col py-6 lg:pt-12 gap-3 px-4 md:px-8 lg:px-24 `}
    >
      <h1 className="text-4xl font-bold blue-text pb-4 border-b-2 mb-4">
        Privacy Policy{" "}
      </h1>

      <p>
        Markettollls ("Company") is committed to protecting your privacy and
        ensuring transparency in how we collect, use, and safeguard your
        personal data. This Privacy Policy ("Policy") applies to the MarketToll
        web and mobile applications (collectively referred to as "Applications")
        and governs data collection, usage, and user consent practices. By using
        the Applications, you agree to the practices outlined in this Policy.
      </p>

      <h3 className="text-2xl font-bold">Data Collection</h3>
      <p>
        The Company collects only the data necessary to ensure secure access to
        your account and improve user experience.{" "}
      </p>
      <h3 className="text-lg font-bold">Personal Information Collected</h3>
      <ul className="list-disc px-10 space-y-4">
        <li>First and last name</li>
        <li>Phone number</li>
        <li>Email address</li>
      </ul>

      <h3 className="text-2xl font-bold">Use of Personal Information</h3>
      <p>
        The Company uses your personal information exclusively for the purpose
        of <span>two-factor authentication (2FA)</span> to enhance account
        security.
      </p>
      <ul className="list-decimal px-10 space-y-4">
        <li>
          <p className="font-bold"> Two-Factor Authentication</p>
          <ul className="list-disc px-10 space-y-4">
            <li>
              Your phone number and email address are used to verify your
              identity during login and sensitive account activities, ensuring
              the security of your account.
            </li>
          </ul>
        </li>
        <li>
          {" "}
          <p className="font-bold"> No Marketing or Promotions</p>
          <ul className="list-disc px-10 space-y-4">
            <li>
              The Company does not use your personal information, including your
              phone number, for marketing, promotional communications, or
              unrelated purposes.
            </li>
          </ul>{" "}
        </li>{" "}
      </ul>

      <h3 className="text-2xl font-bold">Opt-In and Consent for 2FA</h3>
      <p>
        By providing your phone number and email address, you expressly consent
        to their use for two-factor authentication.
      </p>
      <ul className="list-disc px-10 space-y-4">
        <li>
          Consent is obtained during account registration or updates to your
          account details.
        </li>
        <li>
          You may revoke consent by deleting your account, but this may prevent
          you from accessing certain features or services.
        </li>
      </ul>
      <h3 className="text-2xl font-bold">Data Sharing</h3>
      <p>
        The Company does not sell, rent, or lease your personal data to third
        parties. Your personal information may only be shared with trusted
        third-party providers to facilitate two-factor authentication services.
      </p>
      <p>All third parties are contractually obligated to: </p>
      <ul className="list-disc px-10 space-y-4">
        <li>Use your information solely for two-factor authentication.</li>
        <li>Safeguard your information and maintain confidentiality.</li>
      </ul>

      <h3 className="text-2xl font-bold">Data Retention</h3>
      <p>
        The Company retains your personal information only as long as necessary
        to provide two-factor authentication and comply with applicable legal
        obligations.
      </p>

      <h3 className="text-2xl font-bold">Opt-Out Mechanism for 2FA</h3>
      <p>
        Since two-factor authentication is a core security feature, opting out
        of its use may result in restricted access to your account or services.
        You can disable 2FA by contacting us or deleting your account.
      </p>

      <h3 className="text-2xl font-bold">Children Under Thirteen</h3>
      <p>
        The Company does not knowingly collect personal information from
        children under the age of 13. If you are under 13, parental or guardian
        consent is required to use the Applications.
      </p>
      <h3 className="text-2xl font-bold">Data Security</h3>
      <p>
        The Company implements industry-standard measures to protect your
        personal data, including encryption, secure storage, and regular
        security audits.
      </p>
      <h3 className="text-2xl font-bold">Changes to This Policy</h3>
      <p>
        We reserve the right to update this Policy as necessary to reflect
        changes in services or legal requirements. Significant updates will be
        communicated via:
      </p>
      <ul className="list-disc px-10 space-y-4">
        <li> In-app notifications on the mobile application.</li>
        <li> Updates posted on the website.</li>
        <li>Email communication to registered users.</li>
      </ul>
      <h3 className="text-2xl font-bold">Contact Information</h3>
      <p>
        For questions or concerns about this Privacy Policy, contact us at:{" "}
      </p>
      <h3 className="text-lg font-bold">Contact Information</h3>
      <p>2101 Vista Parkway</p>
      <p>West Palm Beach, Florida 33411</p>
      <p>
        Email:{" "}
        <Link to="mailto:info@markettoll.com" className="text-blue-500">
          info@markettoll.com
        </Link>
      </p>
      <p>Phone: 888-392-0333</p>
    </div>
  );
};

export default PrivacyPolicy;
