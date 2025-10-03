import React from "react";
import AddPaymentDetails from "../../components/profile/AddPaymentDetails";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PUBLISHABLE_KEY } from "../../api/api";

const stripePromise = loadStripe(
  STRIPE_PUBLISHABLE_KEY
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
