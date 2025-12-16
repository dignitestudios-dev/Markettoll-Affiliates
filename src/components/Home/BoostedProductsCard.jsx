import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { BASE_URL } from "../../api/api";
import { Airplane } from "../../assets/export";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHeart } from "react-icons/fa6";
import { FiHeart } from "react-icons/fi";

export default function BoostedProducts() {
  const sliderRef = useRef();
  const navigate = useNavigate();
  const [myProducts, setMyProducts] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/users/get-boosted-products`);
      setMyProducts(res?.data?.data || []);
    } catch (error) {
      console.log("my products err >>>>", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  // Infinite auto-scroll
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const scrollSpeed = 1;

    const scroll = () => {
      slider.scrollLeft += scrollSpeed;
      if (slider.scrollLeft >= slider.scrollWidth / 2) {
        slider.scrollLeft = 0; // reset seamlessly
      }
    };

    const interval = setInterval(scroll, 16); // ~60 FPS
    return () => clearInterval(interval);
  }, [myProducts]);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({
      left: -sliderRef.current.clientWidth,
      behavior: "smooth",
    });
  };
  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: sliderRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const handleAddToFavorite = async (item) => {
    if (!user?.token) return navigate("/login");

    try {
      const res = await axios.post(
        `${BASE_URL}/users/wishlist-product/${item?._id}`,
        {},
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      if (res?.status === 201) {
        fetchMyProducts();
        toast.success(res?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error adding favorite");
    }
  };

  const handleRemoveFromFavorite = async (item) => {
    if (!user?.token) return navigate("/login");

    try {
      const res = await axios.delete(`${BASE_URL}/users/wishlist-product/${item?._id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res?.status === 200) {
        fetchMyProducts();
        toast.success(res?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error removing favorite");
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

  if (!myProducts?.length) return null;

  // Duplicate products for infinite scroll
  const allProducts = [...myProducts, ...myProducts];

  return (
    <div className="bg-[#0098EA] rounded-3xl p-6 md:p-10 text-white">
      <h1 className="text-[40px] font-[700] text-center">Boosted Products!</h1>

      <div className="relative mt-6">
        <button
          onClick={scrollLeft}
          className="absolute z-20 -left-8 top-1/2 -translate-y-1/2 bg-[#F1F1F1CC] text-black w-10 h-10 rounded-full shadow-lg hidden md:flex items-center justify-center"
        >
          ‹
        </button>

        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-scroll scroll-smooth no-scrollbar py-4"
        >
          {loading
            ? Array(4).fill(0).map((_, idx) => <ProductSkeleton key={idx} />)
            : allProducts.map((item, index) => (
                <div
                  key={index}
                  className="bg-white cursor-pointer text-black rounded-3xl p-4 min-w-[280px] max-w-[280px] flex-shrink-0"
                >
                  <div className="relative">
                    <img
                      src={item?.images?.[0]?.url}
                      alt="product"
                      className="w-[266px] h-[276px] object-contain border border-gray-100 rounded-2xl"
                    />
                    <span className="absolute top-3 left-3 h-[40px] w-[121px] bg-[#00AAD5] text-white px-3 py-1 rounded-[12px] text-[16px] font-semibold flex items-center gap-1">
                      Boosted <img src={Airplane} className="w-[24px] h-[24px]" alt="" />
                    </span>
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
                    <h2 className="mt-3 text-[16px] font-semibold">{item?.name}</h2>
                    <p className="text-gray-500 text-sm">
                      {item?.fulfillmentMethod?.selfPickup && "Self Pickup"}
                      {item?.fulfillmentMethod?.delivery && "Delivery"}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-[#606060] font-bold text-lg">
                        <span className="text-yellow-300">★</span> 0
                      </span>
                      <span className="text-[#003DAC] font-bold text-lg">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute -right-8 top-1/2 -translate-y-1/2 bg-[#F1F1F1CC] text-black w-10 h-10 rounded-full shadow-lg hidden md:flex items-center justify-center"
        >
          ›
        </button>
      </div>
    </div>
  );
}
