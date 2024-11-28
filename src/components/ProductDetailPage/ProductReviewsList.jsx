import React, { useContext, useEffect, useState } from "react";
import ProductReviewCard from "./ProductReviewCard";
import { IoIosStar } from "react-icons/io";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";

const ProductReviewsList = () => {
  const { productId } = useParams();
  const [productReviews, setProductReviews] = useState([]);
  const { user } = useContext(AuthContext);
  const [error, setError] = useState("");

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
      console.log("product reviews err >>>", error);
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    fetchProductReviews();
  }, []);
  return (
    <div>
      <div className="flex items-center gap-2">
        <h3 className="font-bold blue-text text-[18px]">Reviews</h3>
        <span className="text-[13px] font-normal text-[#5C5C5C]">{`(${productReviews?.length})`}</span>
      </div>
      {productReviews?.length !== null && productReviews?.length > 0 ? (
        <>
          <div className="flex items-center gap-1 my-2">
            <IoIosStar className="text-yellow-400 text-xl" />
            <IoIosStar className="text-yellow-400 text-xl" />
            <IoIosStar className="text-yellow-400 text-xl" />
            <IoIosStar className="text-yellow-400 text-xl" />
            <IoIosStar className="text-gray-300 text-xl" />
            <span className="text-sm">(4)</span>
            <span className="text-sm text-gray-500">24</span>
          </div>
          <div className="flex flex-col items-start gap-2 mt-5">
            <div className="flex items-center justify-between gap-1 w-full">
              <div className="text-xs w-[15%] md:w-[10%]">5 stars</div>
              <div class="w-[70%] md:w-full bg-gray-200 rounded-full h-[8px] dark:bg-gray-700">
                <div class="bg-yellow-400 h-[8px] rounded-full w-[80%]"></div>
              </div>
              <div className="text-xs w-[10%] text-center">18</div>
            </div>
            <div className="flex items-center justify-between gap-1 w-full">
              <div className="text-xs w-[15%] md:w-[10%]">4 stars</div>
              <div class="w-[70%] md:w-full bg-gray-200 rounded-full h-[8px] dark:bg-gray-700">
                <div class="bg-yellow-400 h-[8px] rounded-full w-[80%]"></div>
              </div>
              <div className="text-xs w-[10%] text-center">8</div>
            </div>
            <div className="flex items-center justify-between gap-1 w-full">
              <div className="text-xs w-[15%] md:w-[10%]">3 stars</div>
              <div class="w-[70%] md:w-full bg-gray-200 rounded-full h-[8px] dark:bg-gray-700">
                <div class="bg-yellow-400 h-[8px] rounded-full w-[80%]"></div>
              </div>
              <div className="text-xs w-[10%] text-center">9</div>
            </div>
            <div className="flex items-center justify-between gap-1 w-full">
              <div className="text-xs w-[15%] md:w-[10%]">2 stars</div>
              <div class="w-[70%] md:w-full bg-gray-200 rounded-full h-[8px] dark:bg-gray-700">
                <div class="bg-yellow-400 h-[8px] rounded-full w-[80%]"></div>
              </div>
              <div className="text-xs w-[10%] text-center">6</div>
            </div>
            <div className="flex items-center justify-between gap-1 w-full">
              <div className="text-xs w-[15%] md:w-[10%]">1 stars</div>
              <div class="w-[70%] md:w-full bg-gray-200 rounded-full h-[8px] dark:bg-gray-700">
                <div class="bg-yellow-400 h-[8px] rounded-full w-[80%]"></div>
              </div>
              <div className="text-xs w-[10%] text-center">2</div>
            </div>
          </div>

          <div className="w-full mt-4" />
          <ProductReviewCard />
          <ProductReviewCard />
          <ProductReviewCard />
          <ProductReviewCard />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ProductReviewsList;
