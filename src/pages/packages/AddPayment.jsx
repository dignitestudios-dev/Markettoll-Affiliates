import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AddPaymentPage from "./AddPaymentPage";
import { STRIPE_PUBLISHABLE_KEY } from "../../api/api";

const stripePromise = loadStripe(
  STRIPE_PUBLISHABLE_KEY
);

const AddPayment = () => {
  return (
    <Elements stripe={stripePromise}>
      <AddPaymentPage />
    </Elements>
  );
};

export default AddPayment;
