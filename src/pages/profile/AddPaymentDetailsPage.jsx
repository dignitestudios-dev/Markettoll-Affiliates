import React from "react";
import AddPaymentDetails from "../../components/profile/AddPaymentDetails";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51OsZBgRuyqVfnlHK0Z5w3pTL7ncHPcC75EwkxqQX9BAlmcXeKappekueIzmpWzWYK9L9HEGH3Y2Py2hC7KyVY0Al00przQczPf"
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
