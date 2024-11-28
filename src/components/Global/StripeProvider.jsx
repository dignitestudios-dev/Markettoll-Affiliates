import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51OsZBgRuyqVfnlHK0Z5w3pTL7ncHPcC75EwkxqQX9BAlmcXeKappekueIzmpWzWYK9L9HEGH3Y2Py2hC7KyVY0Al00przQczPf"
);

const StripeProvider = ({ children }) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeProvider;
