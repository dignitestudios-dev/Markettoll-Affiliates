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
import { CartProductContext } from "../../context/cartProductContext";
import { Link, useNavigate } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51OsZBgRuyqVfnlHK0Z5w3pTL7ncHPcC75EwkxqQX9BAlmcXeKappekueIzmpWzWYK9L9HEGH3Y2Py2hC7KyVY0Al00przQczPf"
);

const CartPage = () => {
  const [count, setCount] = useState(0);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const { data, setCartCount } = useContext(CartProductContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isAnyProductToDeliver, setIsAnyProductToDeliver] = useState(null);
  const [removingProducts, setRemovingProducts] = useState(false);
  const navigate = useNavigate();

  const fetchCartProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/users/cart-products`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log("cartProducts >>>", res?.data?.data);
      setCartProducts(res?.data?.data);
      setCartCount(res?.data?.data?.length);
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
    console.log(checkFulfillmentMethod,"fullfilment address")
    setIsAnyProductToDeliver(checkFulfillmentMethod !== undefined);
  }, [cartProducts]);

  const handleIncrementCount = () => {
    if (count == 1) {
      if (data?.deliveryAddress) {
        setCount(count + 1);
      }
    } else if (count === 2 && !data?.paymentMethod) {
      setCount(count);
    } else {
      setCount(count + 1);
    }
  };

  const handleDecrementCount = () => {
    setCount(count - 1);
  };

  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    cartProducts.reduce((total, cartItem) => {
      const price = cartItem.product.price;
      const quantity = cartItem.quantity;
      setTotalPrice(total + price * quantity);
      return total + price * quantity;
    }, 0);
  }, [cartProducts]);

  const removeCartProducts = async () => {
    setRemovingProducts(true);
    try {
      const res = await axios.delete(`${BASE_URL}/users/cart-clear`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log("remove cart prods res >>>", res);
      if (res?.status === 200) {
        toast.success(res?.data?.message);
        navigate("/");
      }
    } catch (error) {
      console.log("err while removing cart products >>>", error);
    } finally {
      setRemovingProducts(false);
    }
  };
console.log(count,"countss");

  if (loading) {
    return <Loader />;
  }

  if (cartProducts?.length === 0) {
    return (
      <div className="w-full padding-x py-6 min-h-[80vh] flex flex-col items-center justify-center gap-5">
        <p className="text-[#5C5C5C]">There are no items in this cart</p>
        <Link
          to="/"
          className="blue-bg text-white px-5 py-3 rounded-2xl text-sm font-semibold"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }
  return (
    <div className="padding-x py-6 w-full">
      <div className="w-full bg-[#F7F7F7] p-6 rounded-[20px] grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2">
          {count === 0 ? (
            <CartProductList
              cartProducts={cartProducts}
              fetchCartProducts={fetchCartProducts}
              loading={removingProducts}
              removeCartProducts={removeCartProducts}
            />
          ) : count === 1 ? (
            isAnyProductToDeliver ? (
              <DeliveryAddress onclick={handleDecrementCount} />
            ) : null
          ) : count === 2 ? (
            <Elements stripe={stripePromise}>
              <SelectPaymentMethod
                onclick={handleDecrementCount}
                count={count}
                setCount={setCount}
              />
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
            setCount={setCount}
            isOrderPlaced={isOrderPlaced}
            setIsOrderPlaced={setIsOrderPlaced}
            cartProducts={cartProducts}
            totalAmount={totalPrice}
            fetchCartProducts={fetchCartProducts}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
