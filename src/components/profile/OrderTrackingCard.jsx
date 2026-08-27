import React from "react";
import { Link } from "react-router-dom";
import { STATUS_STYLES } from "./orderTrackingUtils";

const OrderTrackingCard = ({
  orderId,
  status,
  products = [],
  onViewOrderDetails,
  orderIdNumber
}) => {
  const styles = STATUS_STYLES[status] || STATUS_STYLES.Processing;

  return (
    <div
      className="w-full bg-[#F9FAFA] rounded-[18px] p-5 md:p-7 cursor-pointer"
      onClick={onViewOrderDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onViewOrderDetails?.();
      }}
    >
      <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D6D6D6]">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl md:text-2xl font-bold text-black leading-[30px]">
            Order ID # {orderIdNumber}
          </h3>
          <span
            className={`inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-base font-semibold ${styles.bg} ${styles.text}`}
          >
            <span>{status}</span>
            <span
              className="inline-block w-0 h-0 border-y-[5px] border-y-transparent border-l-[8px]"
              style={{ borderLeftColor: "currentColor" }}
            />
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewOrderDetails?.();
          }}
          className="text-[13px] font-bold text-[#0F0F0F] capitalize tracking-tight"
        >
          view Order Details
        </button>
      </div>

      <div className="w-full">
        {products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={product?.id || index}
              className={`w-full grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] items-center gap-4 py-4 ${
                index < products.length - 1 ? "border-b border-[#D6D6D6]" : ""
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                {product?.image ? (
                  <img
                    src={product.image}
                    alt={product?.name || "product"}
                    className="w-20 h-20 rounded-[15px] object-cover shrink-0 bg-white"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-[15px] shrink-0 bg-[#E8E8E8]" />
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-base font-semibold text-[#333333] truncate">
                    {product?.name || "Product name here"}
                  </span>
                  <span className="text-sm text-[rgba(157,157,157,0.87)] capitalize tracking-tight">
                    {product?.fulfillmentLabel || "pick/delivery"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-start lg:items-center lg:min-w-[100px]">
                <span className="text-sm text-[rgba(157,157,157,0.87)] capitalize tracking-tight">
                  Price
                </span>
                <span className="text-xl font-semibold text-[#003DAC] leading-[25px]">
                  $
                  {Number(product?.price ?? 0).toFixed(2)}
                </span>
              </div>

              <div className="lg:text-end lg:min-w-[100px]">
                {product?.id ? (
                  <Link
                    to={`/products/${product.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[13px] font-semibold text-[rgba(103,103,103,0.87)] capitalize tracking-tight"
                  >
                    view Details
                  </Link>
                ) : (
                  <span className="text-[13px] font-semibold text-[rgba(103,103,103,0.87)] capitalize tracking-tight">
                    view Details
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-[#9D9D9D] py-4">No products in this order.</p>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingCard;
