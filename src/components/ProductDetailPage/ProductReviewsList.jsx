import React, { useContext, useEffect, useState } from "react";
import ProductReviewCard from "./ProductReviewCard";
import { IoIosStar } from "react-icons/io";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";

const ProductReviewsList = ({ avgRating }) => {
  const { productId } = useParams();
  const [productReviews, setProductReviews] = useState([]);
  const { user } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [productRating, setProductRating] = useState(0);
  const [starCounts, setStarCounts] = useState({
    oneStar: 0,
    twoStar: 0,
    threeStar: 0,
    fourStar: 0,
    fiveStar: 0,
  });

  const fetchProductReviews = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/users/product-reviews/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      // console.log("product reviews >>>", res?.data?.data);
      setProductReviews(res?.data?.data);
    } catch (error) {
      // console.log("product reviews err >>>", error);
      setError(error?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchProductReviews();
    if (avgRating) {
      const productAvgRating =
        (avgRating?.oneStar * 1 +
          avgRating?.twoStar * 2 +
          avgRating?.threeStar * 3 +
          avgRating?.fourStar * 4 +
          avgRating?.fiveStar * 5) /
        (avgRating?.oneStar +
          avgRating?.twoStar +
          avgRating?.threeStar +
          avgRating?.fourStar +
          avgRating?.fiveStar);
      const safeAvgRating = isNaN(productAvgRating) ? 0 : productAvgRating;
      setProductRating(safeAvgRating);
    }
  }, []);

  const calculateStarRatings = (reviews) => {
    const counts = {
      oneStar: 0,
      twoStar: 0,
      threeStar: 0,
      fourStar: 0,
      fiveStar: 0,
    };
    let totalRating = 0;
    let totalReviews = 0;

    reviews?.forEach((review) => {
      const rating = review.rating;
      if (rating >= 1 && rating <= 5) {
        counts[`${rating}Star`] += 1;
        totalRating += rating;
        totalReviews += 1;
      }
    });

    const avgRating = totalReviews ? totalRating / totalReviews : 0;
    const safeAvgRating = isNaN(avgRating) ? 0 : avgRating;

    setProductRating(safeAvgRating);
    setStarCounts(counts);
  };

  // console.log("calculateStarRatings >>>", calculateStarRatings());

  return (
    <div>
      <div className="flex items-center gap-2">
        <h3 className="font-bold blue-text text-[18px]">Reviews</h3>
        {productRating > 0 ? (
          <span className="text-[13px] font-normal text-[#5C5C5C]">
            {`(${productReviews?.length})`}
          </span>
        ) : (
          <span className="text-[13px] font-normal text-[#5C5C5C]">(0)</span>
        )}
      </div>
      {productRating > 0 && productReviews.length > 0 ? (
        <>
          <div className="flex items-center gap-1 my-2">
            {/* Render the stars based on the calculated average rating */}
            {[...Array(5)].map((_, index) => (
              <IoIosStar
                key={index}
                className={`text-xl ${
                  productRating >= index + 1
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm">({productReviews.length})</span>
            <span className="text-sm text-gray-500">
              {productReviews.length} reviews
            </span>
          </div>

          {/* Rating progress bars */}
          <div className="flex flex-col items-start gap-2 mt-5">
            {Object.keys(starCounts).map((starType, index) => {
              const count = starCounts[starType];
              const percentage = (count / productReviews.length) * 100;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between gap-1 w-full"
                >
                  <div className="text-xs w-[15%] md:w-[10%]">
                    {5 - index} stars
                  </div>
                  <div className="w-[70%] md:w-full bg-gray-200 rounded-full h-[8px] dark:bg-gray-700">
                    <div
                      className="bg-yellow-400 h-[8px] rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs w-[10%] text-center">{count}</div>
                </div>
              );
            })}
          </div>

          {/* Render Product Review Cards */}
          <div className="w-full mt-4">
            {productReviews.map((review, index) => (
              <ProductReviewCard key={index} review={review} />
            ))}
          </div>
        </>
      ) : (
        <div>No reviews yet.</div>
      )}
    </div>
  );
};

export default ProductReviewsList;
