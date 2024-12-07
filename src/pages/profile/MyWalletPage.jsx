import React from "react";
import MyWallet from "../../components/profile/MyWallet";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51OsZBgRuyqVfnlHK0Z5w3pTL7ncHPcC75EwkxqQX9BAlmcXeKappekueIzmpWzWYK9L9HEGH3Y2Py2hC7KyVY0Al00przQczPf"
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
