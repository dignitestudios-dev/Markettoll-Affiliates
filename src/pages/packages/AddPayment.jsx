import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AddPaymentPage from "./AddPaymentPage";

const stripePromise = loadStripe(
  "pk_live_51OsZBgRuyqVfnlHKwXGmkKnnY60o2JjCdepf5hLJdEeMcoOK1n3pgrfQRVL7JZ1Rb4bwvgHtb2KbRdFssovm7W0500OHyXWtgn"
);

const AddPayment = () => {
  return (
    <Elements stripe={stripePromise}>
      <AddPaymentPage />
    </Elements>
  );
};

export default AddPayment;
