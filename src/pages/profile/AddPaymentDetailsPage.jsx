import React from "react";
import AddPaymentDetails from "../../components/profile/AddPaymentDetails";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_live_51OsZBgRuyqVfnlHKwXGmkKnnY60o2JjCdepf5hLJdEeMcoOK1n3pgrfQRVL7JZ1Rb4bwvgHtb2KbRdFssovm7W0500OHyXWtgn"
);

const AddPaymentDetailsPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <div className="w-full py-6 padding-x">
        <AddPaymentDetails />
      </div>
    </Elements>
  );
};

export default AddPaymentDetailsPage;
