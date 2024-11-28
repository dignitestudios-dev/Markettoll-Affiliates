import React, { useContext, useEffect, useState } from "react";
import CartProductList from "../../components/Cart/CartProductList";
import CartSummary from "../../components/Cart/CartSummary";
import DeliveryAddress from "../../components/Cart/DeliveryAddress";
import SelectPaymentMethod from "../../components/Cart/SelectPaymentMethod";
import OrderReview from "../../components/Cart/OrderReview";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";

const CartPage = () => {
  const [count, setCount] = useState(0);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  // console.log(count);
  const [cartProducts, setCartProducts] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchCartProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/cart-products`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log("cartProducts >>>", res?.data?.data);
      setCartProducts(res?.data?.data);
    } catch (error) {
      console.log("cartProducts err >>>", error);
    }
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  const handleIncrementCount = () => {
    setCount(count + 1);
  };

  const handleDecrementCount = () => {
    setCount(count - 1);
  };
  return (
    <div className="padding-x py-6 w-full">
      <div className="w-full bg-[#F7F7F7] p-6 rounded-[20px] grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2">
          {count === 0 ? (
            <CartProductList cartProducts={cartProducts} />
          ) : count === 1 ? (
            <DeliveryAddress onclick={handleDecrementCount} />
          ) : count === 2 ? (
            <SelectPaymentMethod onclick={handleDecrementCount} />
          ) : count === 3 ? (
            <OrderReview
              onclick={handleDecrementCount}
              isOrderPlaced={isOrderPlaced}
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
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
