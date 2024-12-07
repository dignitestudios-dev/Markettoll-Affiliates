import React, { useContext } from "react";
import { GoArrowLeft } from "react-icons/go";
import { Link } from "react-router-dom";
import { CartProductContext } from "../../context/cartProductContext";
import { AuthContext } from "../../context/authContext";

const OrderReview = ({
  onclick,
  isOrderPlaced,
  isAnyProductToDeliver,
  cartProducts,
}) => {
  const { data, setData } = useContext(CartProductContext);
  const { userProfile } = useContext(AuthContext);
  const deliveryProducts = cartProducts?.filter((p) => {
    return p?.fulfillmentMethod?.delivery == true;
  });
  const pickupProducts = cartProducts?.filter((p) => {
    return p?.fulfillmentMethod?.selfPickup == true;
  });

  return (
    <div className="bg-white rounded-[20px] p-6 flex flex-col items-start gap-5">
      <div>
        <button
          type="button"
          onClick={onclick}
          className="flex items-center gap-1"
        >
          <GoArrowLeft className="text-xl light-blue-text" />
          <span className="text-sm font-medium text-gray-500">Black</span>
        </button>
      </div>
      <h3 className="font-bold text-[28px] blue-text">
        {/* {isOrderPlaced ? "Thank you for placing an order!" : "Order Summary"} */}
        Order Summary
      </h3>
      {isAnyProductToDeliver && (
        <div className="w-full">
          <p className="text-base font-bold">Delivery Address</p>
          <div className="bg-[#F5F5F5] px-5 py-3 rounded-[20px]">
            <span className="text-sm font-normal">
              {data?.deliveryAddress?.apartment_suite}{" "}
              {data?.deliveryAddress?.streetAddress}{" "}
              {data?.deliveryAddress?.city} {data?.deliveryAddress?.state}{" "}
              {data?.deliveryAddress?.country} {data?.deliveryAddress?.zipCode}
            </span>
          </div>
        </div>
      )}

      <div className="w-full">
        <p className="text-base font-bold">Payment Method</p>
        {data?.paymentMethod == "Card" ? (
          <div className="bg-[#fff] border px-5 py-3 rounded-[20px] flex items-center justify-start gap-3">
            <img
              src="/mastercard-icon.png"
              alt="mastercard-icon"
              className="w-[24px] h-[15px]"
            />
            <span className="text-sm font-normal">
              **** **** **** {userProfile?.stripeCustomer?.paymentMethod?.last4}
            </span>
          </div>
        ) : (
          <div className="bg-[#fff] border px-5 py-3 rounded-[20px] flex items-center justify-start gap-3">
            <img
              src="/wallet-icon.png"
              alt="wallet-icon"
              className="w-[24px] h-[20px]"
            />
            <span className="text-sm font-normal">Pay via Wallet</span>
          </div>
        )}
      </div>

      <div className="w-full">
        <p className="text-base font-bold">Delivery Orders</p>
        {/* <div className="flex items-center justify-start gap-3 my-4">
          <img
            src="/seller-profile-img.png"
            alt="seller profile"
            className="w-[25.2px] h-[25.2px]"
          />
          <span className="text-base font-medium">Adam Mill</span>
          <Link to="/seller" className="text-[13px] font-semibold underline">
            View Profile
          </Link>
        </div> */}
        {deliveryProducts && deliveryProducts?.length > 0 && (
          <div className="w-full">
            {deliveryProducts?.map((deliverProduct, index) => {
              return (
                <div
                  className="border-t py-4 flex items-center justify-between"
                  key={index}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={deliverProduct?.product?.images[0]?.url}
                      alt="product image"
                      className="w-[80px] h-[80px] rounded-[15px]"
                    />
                    <div className="flex flex-col items-start justify-center gap-1">
                      <span className="text-base font-semibold">
                        {deliverProduct?.product?.name}
                      </span>
                      <span className="text-sm font-normal text-[#9D9D9DDD]">
                        {deliverProduct?.fulfillmentMethod?.delivery == true
                          ? "Delivery"
                          : "Self-pickup"}
                      </span>
                    </div>
                  </div>
                  <div className="md:flex flex-col items-start gap-1 hidden">
                    <span className="text-[#9D9D9DDD] text-sm">Price</span>
                    <span className="font-semibold text-[20px] blue-text">
                      ${deliverProduct?.product?.price?.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="w-full">
        <p className="text-base font-bold">Pickup Orders</p>
        {/* <div className="flex items-center justify-start gap-3 my-4">
          <img
            src="/seller-profile-img.png"
            alt="seller profile"
            className="w-[25.2px] h-[25.2px]"
          />
          <span className="text-base font-medium">Adam Mill</span>
          <Link to="/seller" className="text-[13px] font-semibold underline">
            View Profile
          </Link>
        </div> */}
        {pickupProducts && pickupProducts?.length > 0 && (
          <div className="w-full">
            {pickupProducts?.map((deliverProduct, index) => {
              return (
                <div
                  className="border-t py-4 flex items-center justify-between"
                  key={index}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={deliverProduct?.product?.images[0]?.url}
                      alt="product image"
                      className="w-[80px] h-[80px] rounded-[15px]"
                    />
                    <div className="flex flex-col items-start justify-center gap-1">
                      <span className="text-base font-semibold">
                        {deliverProduct?.product?.name}
                      </span>
                      <span className="text-sm font-normal text-[#9D9D9DDD]">
                        {deliverProduct?.fulfillmentMethod?.delivery == true
                          ? "Delivery"
                          : "Self-pickup"}
                      </span>
                    </div>
                  </div>
                  <div className="md:flex flex-col items-start gap-1 hidden">
                    <span className="text-[#9D9D9DDD] text-sm">Price</span>
                    <span className="font-semibold text-[20px] blue-text">
                      ${deliverProduct?.product?.price?.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderReview;
