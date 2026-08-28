import React, { useContext, useEffect, useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { FiCalendar, FiX, FiPlus } from "react-icons/fi";
import { LuPackage } from "react-icons/lu";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import SelectProductsModal from "./SelectProductsModal";

const toInputDate = (dateVal) => {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

const getProductImage = (product) => {
  if (!product || typeof product === "string") return null;
  if (Array.isArray(product.images) && product.images.length > 0) {
    const display = product.images.find((img) => img?.displayImage === true);
    if (display?.url) return display.url;
    if (typeof product.images[0] === "string") return product.images[0];
    if (product.images[0]?.url) return product.images[0].url;
  }
  if (Array.isArray(product.productImages) && product.productImages.length > 0) {
    return product.productImages[0];
  }
  if (product.image) return product.image;
  return null;
};

const CreateDiscount = ({ editingDiscount, onBack, onSuccess }) => {
  const { user } = useContext(AuthContext);

  const [discountType, setDiscountType] = useState(
    editingDiscount?.type?.toUpperCase() === "FIXED" ||
      editingDiscount?.discountType?.toLowerCase() === "fixed"
      ? "fixed"
      : "percentage"
  );
  const [discountValue, setDiscountValue] = useState(
    editingDiscount?.value !== undefined
      ? editingDiscount.value
      : editingDiscount?.discountValue || ""
  );
  const [startDate, setStartDate] = useState(
    toInputDate(editingDiscount?.startDate || editingDiscount?.validFrom)
  );
  const [endDate, setEndDate] = useState(
    toInputDate(editingDiscount?.endDate || editingDiscount?.validUntil)
  );
  const [selectedProducts, setSelectedProducts] = useState(
    Array.isArray(editingDiscount?.productIds)
      ? editingDiscount.productIds
      : Array.isArray(editingDiscount?.products)
      ? editingDiscount.products
      : []
  );

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(editingDiscount?._id);

  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.filter((p) =>
        typeof p === "string" ? p !== productId : p._id !== productId
      )
    );
  };

  const todayStr = new Date().toISOString().split("T")[0];

  const handleStartDateChange = (val) => {
    setStartDate(val);
    if (endDate && val && new Date(endDate) < new Date(val)) {
      setEndDate(val);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!discountValue || Number(discountValue) <= 0) {
      toast.error("Please enter a valid discount value");
      return;
    }

    if (discountType === "percentage" && Number(discountValue) > 100) {
      toast.error("Percentage discount cannot exceed 100%");
      return;
    }

    if (!startDate) {
      toast.error("Please select a start date");
      return;
    }

    if (!endDate) {
      toast.error("Please select an end date");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedStart = new Date(startDate);
    selectedStart.setHours(0, 0, 0, 0);

    if (!isEditing && selectedStart < today) {
      toast.error("Start date cannot be in the past. Please select today or a future date.");
      return;
    }

    const selectedEnd = new Date(endDate);
    selectedEnd.setHours(0, 0, 0, 0);

    if (selectedEnd < selectedStart) {
      toast.error("End date cannot be earlier than start date");
      return;
    }

    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product for this discount");
      return;
    }

    const productIds = selectedProducts.map((p) =>
      typeof p === "string" ? p : p?._id
    );

    let startIso;
    try {
      startIso = new Date(`${startDate}T00:00:00.000Z`).toISOString();
    } catch {
      startIso = new Date(startDate).toISOString();
    }

    let endIso;
    try {
      endIso = new Date(`${endDate}T23:59:59.000Z`).toISOString();
    } catch {
      endIso = new Date(endDate).toISOString();
    }

    const payload = {
      productIds: productIds,
      type: discountType === "percentage" ? "PERCENTAGE" : "FIXED_AMOUNT",
      value: Number(discountValue),
      startDate: startIso,
      endDate: endIso,
    };

    setSubmitting(true);
    try {
      if (isEditing) {
        // PATCH /users/discounts/:_id
        await axios.patch(
          `${BASE_URL}/users/discounts/${editingDiscount._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        toast.success("Discount updated successfully!");
      } else {
        // POST /users/discounts
        await axios.post(`${BASE_URL}/users/discounts`, payload, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        toast.success("Discount created successfully!");
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving discount:", error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to save discount. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="padding-x w-full py-6">
      <div className="w-full bg-[#F7F7F7] rounded-[30px] p-6 lg:p-10">
        {/* Top Header */}
        <div className="w-full flex items-center justify-between pb-6 border-b border-gray-200/60">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 text-[#5C5C5C] hover:text-black transition-colors"
            >
              <GoArrowLeft className="light-blue-text text-2xl" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h2 className="blue-text font-bold text-[24px] md:text-[28px]">
              {isEditing ? "Edit Discount" : "Create New Discount"}
            </h2>
          </div>
        </div>

        {/* Main Form Card */}
        <form
          onSubmit={handleSubmit}
          className="w-full mt-8 bg-white rounded-2xl p-6 lg:p-10 border border-gray-100 shadow-sm flex flex-col gap-8"
        >
          {/* Section 1: Discount Type & Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Discount Type */}
            <div className="flex flex-col gap-3">
              <label className="text-gray-900 font-bold text-base">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setDiscountType("percentage")}
                  className={`cursor-pointer rounded-xl p-4 border flex items-center gap-3 transition-all ${
                    discountType === "percentage"
                      ? "border-[#0098EA] bg-[#E5F6FD]/40 ring-1 ring-[#0098EA]"
                      : "border-gray-200 bg-[#FAFAFC] hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      discountType === "percentage"
                        ? "border-[#0098EA]"
                        : "border-gray-400"
                    }`}
                  >
                    {discountType === "percentage" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0098EA]" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">
                      Percentage (%)
                    </p>
                    <p className="text-xs text-gray-500">e.g. 10% off</p>
                  </div>
                </div>

                <div
                  onClick={() => setDiscountType("fixed")}
                  className={`cursor-pointer rounded-xl p-4 border flex items-center gap-3 transition-all ${
                    discountType === "fixed"
                      ? "border-[#0098EA] bg-[#E5F6FD]/40 ring-1 ring-[#0098EA]"
                      : "border-gray-200 bg-[#FAFAFC] hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      discountType === "fixed"
                        ? "border-[#0098EA]"
                        : "border-gray-400"
                    }`}
                  >
                    {discountType === "fixed" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0098EA]" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">
                      Fixed Amount ($)
                    </p>
                    <p className="text-xs text-gray-500">e.g. $5.00 off</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Discount Value */}
            <div className="flex flex-col gap-3">
              <label className="text-gray-900 font-bold text-base">
                Discount Value <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={
                    discountType === "percentage" ? "e.g. 15" : "e.g. 5.00"
                  }
                  className="w-full bg-[#F7F7F7] rounded-xl px-4 py-3.5 text-sm md:text-base outline-none border border-transparent focus:border-[#0098EA] focus:bg-white transition-all placeholder:text-gray-400"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-base">
                  {discountType === "percentage" ? "%" : "$"}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Validity Period */}
          <div className="flex flex-col gap-3">
            <label className="text-gray-900 font-bold text-base">
              Validity Period <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Start Date */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-gray-600">
                  Start Date
                </span>
                <div className="relative">
                  <input
                    type="date"
                    min={todayStr}
                    value={startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="w-full bg-[#F7F7F7] rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#0098EA] focus:bg-white transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-gray-600">
                  End Date
                </span>
                <div className="relative">
                  <input
                    type="date"
                    min={startDate || todayStr}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#F7F7F7] rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#0098EA] focus:bg-white transition-all cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Select Products */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-gray-900 font-bold text-base">
                  Applicable Products <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Select which of your seller products will receive this discount
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(true)}
                className="blue-bg hover:bg-[#0086d1] text-white font-bold px-4 py-2 rounded-xl text-xs md:text-sm flex items-center gap-1.5 transition-all shadow-xs"
              >
                <FiPlus className="w-4 h-4" />
                {selectedProducts.length > 0
                  ? `Manage Products (${selectedProducts.length})`
                  : "Select Products"}
              </button>
            </div>

            {selectedProducts.length === 0 ? (
              <div
                onClick={() => setIsProductModalOpen(true)}
                className="w-full bg-[#FAFAFC] rounded-2xl py-12 px-6 flex flex-col items-center justify-center text-center cursor-pointer border-2 border-dashed border-gray-200 hover:border-[#0098EA] hover:bg-[#E5F6FD]/20 transition-all group"
              >
                <LuPackage className="w-12 h-12 text-gray-300 group-hover:text-[#0098EA] transition-colors mb-2" />
                <p className="text-sm font-bold text-gray-700">
                  No products selected yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Click here to choose products from your listings
                </p>
              </div>
            ) : (
              <div className="bg-[#FAFAFC] rounded-2xl p-5 border border-gray-200 flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs text-gray-600 font-semibold">
                  <span>{selectedProducts.length} Product(s) Selected</span>
                  <button
                    type="button"
                    onClick={() => setSelectedProducts([])}
                    className="text-red-500 hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
                  {selectedProducts.map((product, idx) => {
                    const prodId =
                      typeof product === "string" ? product : product._id;
                    const prodName =
                      typeof product === "string"
                        ? `Product #${prodId.slice(-4)}`
                        : product.name || product.productName || product.title || "Product";
                    const prodImg = getProductImage(product);
                    const prodPrice =
                      typeof product === "object" && product?.price !== undefined
                        ? `$${product.price}`
                        : null;

                    return (
                      <div
                        key={prodId || idx}
                        className="bg-white rounded-xl p-3 border border-gray-200 flex items-center justify-between gap-3 shadow-xs hover:border-gray-300"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-100">
                            {prodImg ? (
                              <img
                                src={prodImg}
                                alt={prodName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <LuPackage className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-gray-900 truncate">
                              {prodName}
                            </h5>
                            {prodPrice && (
                              <p className="text-xs text-[#0098EA] font-extrabold mt-0.5">
                                {prodPrice}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(prodId)}
                          className="w-7 h-7 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center flex-shrink-0 transition-colors"
                          title="Remove product"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="blue-bg hover:bg-[#0086d1] disabled:opacity-60 text-white font-bold px-8 py-3 rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isEditing ? (
                "Update Discount"
              ) : (
                "Save & Activate Discount"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Select Products Modal */}
      <SelectProductsModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        initialSelectedProducts={selectedProducts}
        onConfirmSelection={(products) => setSelectedProducts(products)}
      />
    </div>
  );
};

export default CreateDiscount;
