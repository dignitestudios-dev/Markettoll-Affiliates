import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { BASE_URL } from "../../api/api";
import { Airplane } from "../../assets/export";
import { useNavigate } from "react-router-dom";

export default function BoostedProducts() {
  const sliderRef = useRef();
  const navigate = useNavigate();
  const [myProducts, setMyProducts] = useState([]);
  const { user } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/users/get-boosted-products?page=${page}`
        // { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setMyProducts(res?.data?.data);
    } catch (error) {
      console.log("my products err >>>>", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);
  // Slider auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.scrollBy({
          left: sliderRef.current.clientWidth,
          behavior: "smooth",
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

  const ratingData = {
    oneStar: 0,
    twoStar: 0,
    threeStar: 0,
    fourStar: 0,
    fiveStar: 0,
  };
  const totalReviews =
    ratingData.oneStar +
    ratingData.twoStar +
    ratingData.threeStar +
    ratingData.fourStar +
    ratingData.fiveStar;
  const averageRating = totalReviews
    ? (
        (ratingData.oneStar * 1 +
          ratingData.twoStar * 2 +
          ratingData.threeStar * 3 +
          ratingData.fourStar * 4 +
          ratingData.fiveStar * 5) /
        totalReviews
      ).toFixed(1)
    : 0;

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

  // ✅ Agar boosted products nahi hai, section render nahi hoga
  if (!myProducts?.length) return null;

  return (
    <div className="bg-[#0098EA] rounded-3xl p-6 md:p-10 text-white">
      <h1 className="text-[40px] font-[700] text-center">Boosted Products!</h1>
      <div className="flex justify-end items-center ">
        {/* <button
          onClick={() =>
            navigate("/account/my-listings", { state: { postType: "boosted" } })
          }
          className="text-lg font-semibold hover:underline"
        >
          See all
        </button> */}
      </div>

      <div className="relative">
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
            ? Array(4)
                .fill(0)
                .map((_, idx) => <ProductSkeleton key={idx} />)
            : myProducts.map((item) => (
                <div
                  key={item.id}
                  className="bg-white cursor-pointer text-black rounded-3xl p-4 min-w-[280px] max-w-[280px] flex-shrink-0"
                  onClick={() => navigate(`/products/${item?._id}`)}
                >
                  <div className="relative">
                    <img
                      src={item?.images?.[0]?.url}
                      alt="product"
                      className="w-[266px] h-[276px] object-contain border border-gray-100 rounded-2xl"
                    />
                    <span className="absolute top-3 left-3 h-[40px] w-[121px] bg-[#00AAD5] text-white px-3 py-1 rounded-[12px] text-[16px] font-semibold flex items-center gap-1">
                      Boosted{" "}
                      <img
                        src={Airplane}
                        className="w-[24px] h-[24px]"
                        alt=""
                      />
                    </span>
                    <button className="absolute top-3 right-3 text-2xl text-white">
                      🤍
                    </button>
                  </div>

                  <h2 className="mt-3 text-[16px] font-semibold">
                    {item?.name}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {item?.fulfillmentMethod?.selfPickup && "Self Pickup"}
                    {item?.fulfillmentMethod?.delivery && "Delivery"}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[#606060] font-bold text-lg">
                      <span className="text-yellow-300">★</span> {averageRating}
                    </span>
                    <span className="text-[#003DAC] font-bold text-lg">
                      ${item.price.toFixed(2)}
                    </span>
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
