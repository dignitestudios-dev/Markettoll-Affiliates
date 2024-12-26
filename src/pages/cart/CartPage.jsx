import React, { useContext, useEffect, useState } from "react";
import CartProductList from "../../components/Cart/CartProductList";
import CartSummary from "../../components/Cart/CartSummary";
import DeliveryAddress from "../../components/Cart/DeliveryAddress";
import SelectPaymentMethod from "../../components/Cart/SelectPaymentMethod";
import OrderReview from "../../components/Cart/OrderReview";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import Loader from "../../components/Global/Loader";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51OsZBgRuyqVfnlHK0Z5w3pTL7ncHPcC75EwkxqQX9BAlmcXeKappekueIzmpWzWYK9L9HEGH3Y2Py2hC7KyVY0Al00przQczPf"
);

const CartPage = () => {
  const [count, setCount] = useState(0);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isAnyProductToDeliver, setIsAnyProductToDeliver] = useState(null);
  console.log("isAnyProductToDeliver >>>", isAnyProductToDeliver);

  const fetchCartProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/users/cart-products`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      // console.log("cartProducts >>>", res?.data?.data);
      setCartProducts(res?.data?.data);
    } catch (error) {
      console.log("cartProducts err >>>", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  useEffect(() => {
    const checkFulfillmentMethod = cartProducts?.find((p) => {
      return p?.fulfillmentMethod?.delivery === true;
    });
    setIsAnyProductToDeliver(checkFulfillmentMethod !== undefined);
  }, [cartProducts]);

  const handleIncrementCount = () => {
    setCount(count + 1);
  };

  const handleDecrementCount = () => {
    setCount(count - 1);
  };

  let totalAmount = cartProducts.reduce((total, cartItem) => {
    const price = cartItem.product.price;
    const quantity = cartItem.quantity;
    return total + price * quantity;
  }, 0);

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="padding-x py-6 w-full">
      <div className="w-full bg-[#F7F7F7] p-6 rounded-[20px] grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2">
          {count === 0 ? (
            <CartProductList
              cartProducts={cartProducts}
              fetchCartProducts={fetchCartProducts}
            />
          ) : count === 1 ? (
            isAnyProductToDeliver ? (
              <DeliveryAddress onclick={handleDecrementCount} />
            ) : (
              <Elements stripe={stripePromise}>
                <SelectPaymentMethod onclick={handleDecrementCount} />
              </Elements>
            )
          ) : count === 2 ? (
            <Elements stripe={stripePromise}>
              <SelectPaymentMethod onclick={handleDecrementCount} />
            </Elements>
          ) : count === 3 ? (
            <OrderReview
              onclick={handleDecrementCount}
              isOrderPlaced={isOrderPlaced}
              isAnyProductToDeliver={isAnyProductToDeliver}
              cartProducts={cartProducts}
            />
          ) : (
            <></>
          )}
        </div>
        <div className="col-span-1">
          <CartSummary
            onclick={handleIncrementCount}
            count={count}
            isOrderPlaced={isOrderPlaced}
            setIsOrderPlaced={setIsOrderPlaced}
            cartProducts={cartProducts}
            totalAmount={totalAmount}
            fetchCartProducts={fetchCartProducts}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
