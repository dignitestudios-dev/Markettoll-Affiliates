import React, { useContext, useEffect, useState, useMemo } from "react";
import { FiSearch, FiCheck, FiPlus } from "react-icons/fi";
import { IoIosStar } from "react-icons/io";
import { LuPackage } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import Loader from "../Global/Loader";

const getProductImage = (product) => {
  if (!product) return null;
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

const getProductRating = (product) => {
  if (!product?.avgRating) return 0;
  const {
    oneStar = 0,
    twoStar = 0,
    threeStar = 0,
    fourStar = 0,
    fiveStar = 0,
  } = product.avgRating;
  const totalStars =
    oneStar * 1 + twoStar * 2 + threeStar * 3 + fourStar * 4 + fiveStar * 5;
  const totalCount = oneStar + twoStar + threeStar + fourStar + fiveStar;
  if (totalCount === 0) return 0;
  const avg = totalStars / totalCount;
  return isNaN(avg) ? 0 : Math.round(avg * 10) / 10;
};

const SelectProductsModal = ({
  isOpen,
  onClose,
  initialSelectedProducts = [],
  onConfirmSelection,
}) => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (isOpen) {
      const ids = initialSelectedProducts.map((p) =>
        typeof p === "string" ? p : p?._id
      );
      setSelectedIds(ids);
    }
  }, [isOpen, initialSelectedProducts]);

  useEffect(() => {
    if (isOpen && user?._id) {
      fetchSellerProducts();
    }
  }, [isOpen, user?._id, page]);

  const fetchSellerProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/users/seller-products/${user?._id}?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      const data = res?.data?.data || res?.data?.products || res?.data || [];
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching seller products for discount:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    return products.filter((p) =>
      (p?.name || p?.productName || p?.title || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const toggleSelect = (productId) => {
    setSelectedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (
      selectedIds.length === filteredProducts.length &&
      filteredProducts.length > 0
    ) {
      setSelectedIds([]);
    } else {
      const allVisibleIds = filteredProducts.map((p) => p._id);
      setSelectedIds(Array.from(new Set([...selectedIds, ...allVisibleIds])));
    }
  };

  const handleDone = () => {
    const selectedObjects = selectedIds.map((id) => {
      const found = products.find((p) => p._id === id);
      return found || { _id: id };
    });
    onConfirmSelection(selectedObjects);
    onClose();
  };

  if (!isOpen) return null;

  const isAllSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => selectedIds.includes(p._id));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-[#FAFAFC]">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold blue-text">
              Select Products for Discount
            </h2>
            <span className="bg-[#E5F6FD] text-[#0098EA] text-xs font-bold px-3 py-1 rounded-full">
              {selectedIds.length} Selected
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
          <div className="relative w-full sm:w-96">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name..."
              className="w-full bg-[#F5F6F8] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none border border-transparent focus:border-[#0098EA] transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-sm font-semibold text-[#0098EA] hover:text-[#0086d1] transition-colors py-1.5 px-3 rounded-lg hover:bg-[#E5F6FD]"
            >
              {isAllSelected ? "Deselect All" : "Select All Products"}
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="p-6 flex-1 overflow-y-auto min-h-[350px] bg-[#FAFAFC]">
          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <Loader />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
              <LuPackage className="w-16 h-16 text-gray-300 mb-3" />
              <p className="font-bold text-base text-gray-700">
                No products found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {searchQuery
                  ? "No products matching your search criteria."
                  : "You have not listed any products yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredProducts.map((product) => {
                const isSelected = selectedIds.includes(product._id);
                const imgUrl = getProductImage(product);
                const rating = getProductRating(product);

                return (
                  <div
                    key={product._id}
                    onClick={() => toggleSelect(product._id)}
                    className={`bg-white rounded-[20px] p-3 relative w-full custom-shadow cursor-pointer transition-all border-2 select-none flex flex-col justify-between ${
                      isSelected
                        ? "border-[#0098EA] ring-2 ring-[#0098EA]/30 bg-[#F0F9FE]/30 scale-[1.01]"
                        : "border-transparent hover:border-gray-200"
                    }`}
                  >
                    <div>
                      {/* Image Container */}
                      <div className="w-full relative h-[200px] rounded-[15px] overflow-hidden bg-gray-100 flex items-center justify-center">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={product?.name || "Product"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <LuPackage className="w-12 h-12 text-gray-300" />
                        )}

                        {/* Top-Right Selection Checkbox Badge */}
                        <div
                          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
                            isSelected
                              ? "bg-[#0098EA] text-white ring-2 ring-white scale-110"
                              : "bg-white/90 backdrop-blur-xs text-gray-400 border border-gray-200 hover:border-[#0098EA]"
                          }`}
                        >
                          {isSelected ? (
                            <FiCheck className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <FiPlus className="w-4 h-4" />
                          )}
                        </div>
                      </div>

                      {/* Title & Info matching Web ProductCard */}
                      <h4 className="mt-3 font-semibold text-base text-gray-900 truncate" title={product?.name || product?.productName || "Product"}>
                        {product?.name || product?.productName || "Product"}
                      </h4>
                      <div className="flex flex-wrap items-center gap-1.5 my-2">
                        {/* Fulfillment Tag */}
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                            product?.fulfillmentMethod?.selfPickup
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-blue-50 text-[#003DAC] border-blue-200"
                          }`}
                        >
                          {product?.fulfillmentMethod?.selfPickup
                            ? "Pickup"
                            : "Delivery"}
                        </span>

                        {/* Stock Tag */}
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                            Number(product?.quantity ?? 0) > 0
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-600 border-rose-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              Number(product?.quantity ?? 0) > 0
                                ? "bg-emerald-500"
                                : "bg-rose-500"
                            }`}
                          />
                          {Number(product?.quantity ?? 0) > 0
                            ? `Stock: ${product?.quantity}`
                            : "Out of Stock"}
                        </span>

                        {/* Sold Tag */}
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 border border-gray-200 flex items-center gap-1">
                          Sold: <span className="font-semibold text-gray-900">{product?.quantitySold ?? 0}</span>
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Rating & Price */}
                    <div className="w-full flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <IoIosStar className="text-yellow-400 text-base" />
                        <span className="font-semibold">{rating}</span>
                      </div>
                      <p className="text-[18px] font-bold blue-text">
                        ${product?.price || "0.0"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-[#FAFAFC] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous Page
            </button>
            <span className="text-xs text-gray-500 font-medium">
              Page {page}
            </span>
            <button
              type="button"
              disabled={products.length === 0}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next Page
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDone}
              className="blue-bg hover:bg-[#0086d1] text-white font-bold px-8 py-2.5 rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              Confirm Selection ({selectedIds.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectProductsModal;
