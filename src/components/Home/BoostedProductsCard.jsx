import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { BASE_URL } from "../../api/api";
import { Airplane } from "../../assets/export";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHeart } from "react-icons/fa6";
import { FiHeart } from "react-icons/fi";

export default function BoostedProducts() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/users/get-boosted-products`);
      setMyProducts(res?.data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleAddToFavorite = async (item) => {
    if (!user?.token) return navigate("/login");
    try {
      await axios.post(
        `${BASE_URL}/users/wishlist-product/${item?._id}`,
        {},
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      fetchMyProducts();
      toast.success("Added to wishlist");
    } catch {
      toast.error("Error adding favorite");
    }
  };

  const handleRemoveFromFavorite = async (item) => {
    if (!user?.token) return navigate("/login");
    try {
      await axios.delete(`${BASE_URL}/users/wishlist-product/${item?._id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      fetchMyProducts();
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Error removing favorite");
    }
  };

  const ProductSkeleton = () => (
    <div className="bg-gray-200 rounded-3xl p-4 min-w-[280px] max-w-[280px] flex-shrink-0 animate-pulse">
      <div className="w-full h-56 bg-gray-300 rounded-2xl mb-3" />
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="flex justify-between mt-3">
        <div className="h-6 w-12 bg-gray-300 rounded"></div>
        <div className="h-6 w-16 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  if (!myProducts.length) return null;

  return (
    <div className="bg-[#0098EA] rounded-3xl p-6 md:p-10 text-white">
      <div className="flex  items-center justify-between">
        <h1 className="text-[40px] font-[700] text-center">
          Boosted Products!
        </h1>
        <p
          className="text-[18px] font-[500] underline cursor-pointer "
          onClick={() => navigate("/all-boosted")}
        >
          See All
        </p>
      </div>

      <div className="relative mt-6">
        {/* UI arrows (decorative only) */}
        <button
          disabled
          className="absolute z-20 -left-6 top-1/2 -translate-y-1/2
                     bg-white/80 text-black w-10 h-10 rounded-full shadow-lg
                     hidden md:flex items-center justify-center
                     cursor-default pointer-events-none"
        >
          ‹
        </button>

        <button
          disabled
          className="absolute z-20 -right-6 top-1/2 -translate-y-1/2
                     bg-white/80 text-black w-10 h-10 rounded-full shadow-lg
                     hidden md:flex items-center justify-center
                     cursor-default pointer-events-none"
        >
          ›
        </button>

        {/* Marquee */}
        {loading ? (
          <ProductSkeleton />
        ) : (
          <div className="marquee-wrapper">
            <div className="marquee  cursor-pointer">
              {[...myProducts, ...myProducts]?.map((item, index) => {
                const pricing = item?.pricing;
                const hasDiscount =
                  Boolean(pricing?.discount) ||
                  (pricing?.discountedPrice !== undefined &&
                    pricing?.originalPrice !== undefined &&
                    Number(pricing?.discountedPrice) <
                      Number(pricing?.originalPrice));

                const discountType =
                  pricing?.discount?.type?.toUpperCase() ||
                  (pricing?.discountAmount ? "FIXED_AMOUNT" : "");

                const discountBadgeLabel =
                  discountType === "PERCENTAGE"
                    ? `${
                        pricing?.discount?.value ||
                        Math.round(
                          ((Number(pricing?.originalPrice) -
                            Number(pricing?.discountedPrice)) /
                            Number(pricing?.originalPrice)) *
                            100
                        )
                      }% OFF`
                    : pricing?.discountAmount || pricing?.discount?.value
                    ? `$${
                        pricing?.discountAmount || pricing?.discount?.value
                      } OFF`
                    : "";

                const originalPrice =
                  pricing?.originalPrice !== undefined
                    ? Number(pricing.originalPrice)
                    : Number(item?.price || 0);

                const finalPrice = hasDiscount
                  ? Number(pricing?.discountedPrice)
                  : Number(item?.price || 0);

                return (
                  <div
                    onClick={() => navigate(`/products/${item?._id}`)}
                    key={index}
                    className="bg-white cursor-pointer text-black rounded-3xl p-4
                             min-w-[280px] max-w-[280px] flex-shrink-0 mx-3"
                  >
                    <div className="relative">
                      <img
                        src={item?.images?.[0]?.url}
                        alt={item?.name}
                        className="w-[266px] h-[276px] object-contain
                                 border border-gray-100 rounded-2xl"
                      />

                      <span
                        className="absolute top-3 left-3 h-[40px] w-[121px]
                                     bg-[#00AAD5] text-white px-3 py-1
                                     rounded-[12px] text-[16px] font-semibold
                                     flex items-center gap-1"
                      >
                        Boosted
                        <img src={Airplane} className="w-6 h-6" alt="" />
                      </span>

                      {hasDiscount && (
                        <span className="absolute top-3 right-3 bg-[#E53935] text-white px-2.5 py-1 rounded-[10px] text-xs font-extrabold shadow-md tracking-wide">
                          {discountBadgeLabel}
                        </span>
                      )}
                    </div>

                    <div>
                      <h2 className="mt-3 text-[16px] font-semibold truncate" title={item?.name}>
                        {item?.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-1.5 my-2">
                        {/* Fulfillment Tag */}
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                            item?.fulfillmentMethod?.selfPickup
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-blue-50 text-[#003DAC] border-blue-200"
                          }`}
                        >
                          {item?.fulfillmentMethod?.selfPickup ? "Pickup" : "Delivery"}
                        </span>

                        {/* Stock Tag */}
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                            Number(item?.quantity ?? 0) > 0
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-600 border-rose-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              Number(item?.quantity ?? 0) > 0
                                ? "bg-emerald-500"
                                : "bg-rose-500"
                            }`}
                          />
                          {Number(item?.quantity ?? 0) > 0
                            ? `Stock: ${item?.quantity}`
                            : "Out of Stock"}
                        </span>

                        {/* Sold Tag */}
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 border border-gray-200 flex items-center gap-1">
                          Sold: <span className="font-semibold text-gray-900">{item?.quantitySold ?? 0}</span>
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <span className="text-[#606060] font-bold text-lg">
                          ★ 0
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span
                            className={`font-bold text-lg ${
                              hasDiscount ? "text-[#E53935]" : "text-[#003DAC]"
                            }`}
                          >
                            ${finalPrice.toFixed(2)}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through font-medium">
                              ${originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
