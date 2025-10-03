import React from "react";
import MyWallet from "../../components/profile/MyWallet";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PUBLISHABLE_KEY } from "../../api/api";

const stripePromise = loadStripe(
  STRIPE_PUBLISHABLE_KEY
);

const MyWalletPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <div className="w-full padding-x py-6">
        <MyWallet />
      </div>
    </Elements>
  );
};

export default MyWalletPage;
