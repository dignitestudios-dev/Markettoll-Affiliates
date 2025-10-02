import React from "react";
import MyWallet from "../../components/profile/MyWallet";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_live_51OsZBgRuyqVfnlHKwXGmkKnnY60o2JjCdepf5hLJdEeMcoOK1n3pgrfQRVL7JZ1Rb4bwvgHtb2KbRdFssovm7W0500OHyXWtgn"
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
