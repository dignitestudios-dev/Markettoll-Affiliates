import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";

const CartSummary = ({
  onclick,
  count,
  isOrderPlaced,
  setIsOrderPlaced,
  cartProducts,
}) => {
  //   const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const handlePlaceOrder = () => {
    setIsOrderPlaced(!isOrderPlaced);
  };
  let totalAmount = cartProducts.reduce((total, cartItem) => {
    const price = cartItem.product.price;
    const quantity = cartItem.quantity;
    return total + price * quantity; // Add price * quantity to the total
  }, 0);

  console.log("Total Amount: $", totalAmount.toFixed(2));

  return (
    <div className="bg-white rounded-[20px] p-6">
      <h3 className="font-bold text-[28px] blue-text">Order Summary</h3>

      <div className="w-full mt-4 flex items-center justify-between">
        <span className="text-base text-[#000000B2]">
          Subtotal ({cartProducts?.quantity} items)
        </span>
        <span className="text-base text-[#000000B2]">
          ${totalAmount.toFixed(2)}
        </span>
      </div>

      <div className="border w-full my-4" />

      <div className="w-full flex items-center justify-between">
        <span className="text-base font-extrabold">Total</span>
        <span className="text-base font-extrabold">
          ${totalAmount.toFixed(2)}
        </span>
      </div>

      <button
        type="button"
        onClick={count === 3 ? handlePlaceOrder : onclick}
        className="py-3 rounded-2xl text-center w-full font-bold text-white text-base blue-bg mt-5 outline-none"
      >
        {count === 0
          ? "Proceed To Checkout"
          : count === 3
          ? "Place Order"
          : count === 4
          ? "Continue to Shopping"
          : "Next"}
      </button>
      <OrderModal isOrderPlaced={isOrderPlaced} onclick={handlePlaceOrder} />
    </div>
  );
};

export default CartSummary;

const OrderModal = ({ isOrderPlaced, onclick }) => {
  return (
    isOrderPlaced && (
      <div className="w-full h-screen bg-[rgba(0,0,0,0.5)] fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-[15px] p-8 relative w-[440px] h-[228px] flex flex-col items-center justify-center gap-1">
          <button
            type="button"
            onClick={onclick}
            className="w-6 h-6 bg-[#F7F7F7] rounded-full p-1 absolute top-4 right-4"
          >
            <IoClose className="w-full h-full" />
          </button>

          <div className="w-[69.67px] h-[69.67px] blue-bg rounded-full p-2.5 mb-2">
            <FaCheck className="w-full h-full text-white" />
          </div>
          <span className="text-[18px] blue-text font-bold">Order Placed</span>
          <span className="text-base text-[#5C5C5C]">
            Your order has been placed successfully!
          </span>
        </div>
      </div>
    )
  );
};
