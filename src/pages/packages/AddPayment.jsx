import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AddPaymentPage from "./AddPaymentPage";

const stripePromise = loadStripe(
  "pk_test_51OsZBgRuyqVfnlHK0Z5w3pTL7ncHPcC75EwkxqQX9BAlmcXeKappekueIzmpWzWYK9L9HEGH3Y2Py2hC7KyVY0Al00przQczPf"
);

const AddPayment = () => {
  return (
    <Elements stripe={stripePromise}>
      <AddPaymentPage />
    </Elements>
  );
};

export default AddPayment;
