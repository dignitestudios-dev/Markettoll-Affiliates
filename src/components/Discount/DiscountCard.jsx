import React from "react";
import { FiEdit2, FiTrash2, FiCalendar } from "react-icons/fi";
import { LuPackage } from "react-icons/lu";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const DiscountCard = ({ discount, onEdit, onDelete }) => {
  const isPercentage =
    discount?.type?.toUpperCase() === "PERCENTAGE" ||
    discount?.discountType?.toUpperCase() === "PERCENTAGE";

  const val =
    discount?.value !== undefined
      ? discount.value
      : discount?.discountValue !== undefined
      ? discount.discountValue
      : 0;

  const discountLabel = isPercentage ? `${val}% OFF` : `$${val} OFF`;

  const products = Array.isArray(discount?.productIds)
    ? discount.productIds
    : Array.isArray(discount?.products)
    ? discount.products
    : [];
  const productCount = products.length;
  const firstProduct = products[0];

  const getProductImage = (prod) => {
    if (!prod || typeof prod === "string") return null;
    if (Array.isArray(prod.images) && prod.images.length > 0) {
      const display = prod.images.find((img) => img?.displayImage === true);
      if (display?.url) return display.url;
      if (typeof prod.images[0] === "string") return prod.images[0];
      if (prod.images[0]?.url) return prod.images[0].url;
    }
    if (Array.isArray(prod.productImages) && prod.productImages.length > 0) {
      return prod.productImages[0];
    }
    if (prod.image) return prod.image;
    return null;
  };

  const getProductTitle = (prod) => {
    if (!prod || typeof prod === "string") return "";
    return prod.name || prod.productName || prod.title || "";
  };

  const startDateFormatted = formatDate(discount?.startDate || discount?.validFrom);
  const endDateFormatted = formatDate(discount?.endDate || discount?.validUntil);

  const productNames = products
    .map((prod) => getProductTitle(prod))
    .filter(Boolean)
    .join(", ");

  return (
    <div className="w-full bg-white rounded-2xl p-5 border border-gray-200 hover:border-[#0098EA]/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 group">
      <div className="flex flex-col gap-3">
        {/* Top Badge & Actions */}
        <div className="flex items-center justify-between">
          <span className="bg-[#E5F6FD] text-[#0098EA] font-bold text-xs md:text-sm px-3.5 py-1.5 rounded-lg tracking-wide shadow-xs">
            {discountLabel}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(discount)}
              className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-[#E5F6FD] text-gray-600 hover:text-[#0098EA] flex items-center justify-center transition-colors"
              title="Edit Discount"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(discount)}
              className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-[#E05353] flex items-center justify-center transition-colors"
              title="Delete Discount"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Images Row */}
        <div className="flex items-center gap-2 py-1 overflow-x-auto">
          {products.length > 0 ? (
            <>
              {products.slice(0, 3).map((prod, idx) => {
                const imgUrl = getProductImage(prod);
                return (
                  <div
                    key={idx}
                    className="w-14 h-14 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center"
                  >
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt="Product"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <LuPackage className="text-gray-400 w-5 h-5" />
                    )}
                  </div>
                );
              })}
              {products.length > 3 && (
                <div className="w-14 h-14 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0 border border-gray-200">
                  +{products.length - 3}
                </div>
              )}
            </>
          ) : (
            <div className="w-14 h-14 rounded-xl border border-dashed border-gray-300 flex items-center justify-center bg-gray-50 text-gray-400">
              <LuPackage className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
            <LuPackage className="w-4 h-4 text-[#0098EA]" />
            <span>
              {productCount} {productCount === 1 ? "Product" : "Products"} Included
            </span>
          </div>
          {productNames ? (
            <p
              className="text-xs text-gray-500 font-medium truncate"
              title={productNames}
            >
              {productNames}
            </p>
          ) : null}
        </div>
      </div>

      {/* Date Footer */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
          <span>
            {endDateFormatted ? `Ends: ${endDateFormatted}` : "No expiry date"}
          </span>
        </div>
        {startDateFormatted && (
          <span className="text-[11px] text-gray-400">
            From: {startDateFormatted}
          </span>
        )}
      </div>
    </div>
  );
};

export default DiscountCard;
