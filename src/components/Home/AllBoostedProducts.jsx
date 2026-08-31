import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { BASE_URL } from "../../api/api";
import { Airplane } from "../../assets/export";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHeart } from "react-icons/fa6";
import { FiArrowLeft, FiHeart } from "react-icons/fi";

export default function AllBoostedProducts() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch products
  const fetchMyProducts = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/users/get-boosted-products?page=${page}`
      );
      const newProducts = res?.data?.data || [];

      if (newProducts.length === 0) setHasMore(false);

      setMyProducts((prev) => [...prev, ...newProducts]);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching boosted products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, [page]);

  // Favorite handlers
  const handleAddToFavorite = async (item) => {
    if (!user?.token) return navigate("/login");
    try {
      await axios.post(
        `${BASE_URL}/users/wishlist-product/${item?._id}`,
        {},
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setMyProducts((prev) =>
        prev.map((p) => (p._id === item._id ? { ...p, isWishListed: true } : p))
      );
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
      setMyProducts((prev) =>
        prev.map((p) =>
          p._id === item._id ? { ...p, isWishListed: false } : p
        )
      );
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Error removing favorite");
    }
  };

  // Skeleton for loading
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

  // Infinite scroll using window scroll
  useEffect(() => {
    let debounceTimer = null;

    const handleScroll = () => {
      if (debounceTimer) clearTimeout(debounceTimer);

      debounceTimer = setTimeout(() => {
        if (
          window.innerHeight + window.scrollY >=
            document.body.scrollHeight - 150 &&
          !loading &&
          hasMore
        ) {
          setPage((prev) => prev + 1);
        }
      }, 150); // 150ms debounce
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [loading, hasMore]);

  return (
    <div className="padding-x items-start gap-x-20 py-12 w-full">
      <div className="w-full mb-6">
        <Link
          onClick={() => navigate(-1)}
          className="flex items-center justify-start gap-1"
        >
          <FiArrowLeft className="light-blue-text text-lg" />
          <span className="font-medium text-gray-500">Back</span>
        </Link>

        <h2 className="font-bold blue-text text-[26px] mt-3 mb-3">
          Boosted Products!
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {myProducts?.map((item) => {
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
              key={item._id}
              className="bg-white rounded-[20px] p-3 relative w-full custom-shadow cursor-pointer"
            >
              <div className="relative">
                <img
                  src={item?.images?.[0]?.url}
                  alt={item?.name}
                  className="w-full h-64 object-contain border border-gray-100 rounded-2xl"
                  onClick={() => navigate(`/products/${item?._id}`)}
                />

                <span className="absolute top-3 left-3 h-[40px] w-[121px] bg-[#00AAD5] text-white px-3 py-1 rounded-[12px] text-[16px] font-semibold flex items-center gap-1">
                  Boosted
                  <img src={Airplane} className="w-6 h-6" alt="" />
                </span>

                {hasDiscount && (
                  <span className="absolute top-3 right-12 bg-[#E53935] text-white px-2.5 py-1 rounded-[10px] text-xs font-extrabold shadow-md tracking-wide">
                    {discountBadgeLabel}
                  </span>
                )}

                <button
                  type="button"
                  className="absolute z-10 top-4 right-4"
                  onClick={() =>
                    item?.isWishListed
                      ? handleRemoveFromFavorite(item)
                      : handleAddToFavorite(item)
                  }
                >
                  {item?.isWishListed ? (
                    <FaHeart className="text-white text-2xl" />
                  ) : (
                    <FiHeart className="text-white text-2xl" />
                  )}
                </button>
              </div>

              <div onClick={() => navigate(`/products/${item?._id}`)}>
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
                  <span className="text-[#606060] font-bold text-lg">★ 0</span>
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

        {loading &&
          Array(4)
            .fill(0)
            .map((_, idx) => <ProductSkeleton key={idx} />)}
      </div>

      {!hasMore && (
        <p className="text-center text-gray-500 mt-6">
          You have reached the end of boosted products.
        </p>
      )}
    </div>
  );
}
