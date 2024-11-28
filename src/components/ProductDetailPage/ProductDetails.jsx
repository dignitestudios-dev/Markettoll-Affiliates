import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { IoIosStar } from "react-icons/io";
import { FaMinus, FaPlus } from "react-icons/fa6";
import ProductReviewsList from "./ProductReviewsList";
import ChooseDeliveryModal from "./ChooseDeliveryModal";
import { FiHeart } from "react-icons/fi";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import ProductSeller from "./ProductSeller";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [addToCart, setAddToCart] = useState(false);
  const { productId } = useParams();
  const { user } = useContext(AuthContext);
  const [displayImage, setDisplayImage] = useState(null);
  const [fulfillmentMethod, setFulfillmentMethod] = useState({
    selfPickup: null,
    delivery: null,
  });

  const handleShowPopup = () => {
    setShowPopup(!showPopup);
  };

  const handleAddToCart = async (method) => {
    setFulfillmentMethod(method);
    try {
      const res = await axios.post(
        `${BASE_URL}/users/cart-product/${productId}`,
        {
          fulfillmentMethod: method,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log("add to cart res >>>>>>", res);
      if (res.status == 201) {
        setAddToCart(true);
      }
      handleShowPopup();
    } catch (error) {
      console.log("add to cart errr >>>>>", error);
      toast.error(error?.response?.data?.message);
      handleShowPopup();
    }
  };

  const handleFetchProduct = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log("product data >>>", res?.data?.data);
      setProduct(res?.data?.data);
    } catch (error) {
      console.log("product err >>>", error);
    }
  };

  useEffect(() => {
    handleFetchProduct();
  }, []);

  useEffect(() => {
    if (product?.images?.length > 0) {
      const defaultDisplayImage =
        product.images.find((image) => image.displayImage === true) ||
        product.images[0];
      setDisplayImage(defaultDisplayImage);
    }
  }, [product]);

  const handleThumbnailClick = (image) => {
    setDisplayImage(image);
  };

  const handleIncrementQuantity = async (type) => {
    const endpoint =
      type === "increment"
        ? `${BASE_URL}/users/cart-product-increment-by-one/${productId}`
        : `${BASE_URL}/users/cart-product-decrement-by-one/${productId}`;
    try {
      const res = await axios.put(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log("increment by one res >>>>>>", res);
      if (res.status == 200) {
        setQuantity(res?.data?.data?.quantity);
      }
    } catch (error) {
      console.log("decrement by one err >>>>>>", error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="w-full relative">
      <div className="w-full p-4 rounded-[30px] bg-[#F7F7F7]">
        <div className="w-full p-6 rounded-[30px] bg-[#ffff]">
          <Link to="/" className="flex items-center gap-1 mb-5">
            <GoArrowLeft className="text-xl" />
            <span className="font-medium text-sm text-[#5C5C5C]">Back</span>
          </Link>
          <div className="w-full flex flex-col lg:flex-row justify-start gap-x-8 gap-y-6">
            <div className="w-full relative">
              <button type="button" className="absolute z-10 top-4 right-4">
                <FiHeart className="text-white text-2xl" />
              </button>
              <img
                src={displayImage?.url}
                alt="product image"
                className="w-full h-auto lg:h-[376px] object-cover rounded-xl"
              />
              <div className="w-full grid grid-cols-4 mt-3 gap-3">
                {product?.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image?.url}
                    alt={`Thumbnail ${index + 1}`}
                    className={`rounded-xl h-[97px] w-full object-cover cursor-pointer ${
                      image?.url === displayImage?.url
                        ? "border-2 border-blue-500"
                        : ""
                    }`}
                    onClick={() => handleThumbnailClick(image)}
                  />
                ))}
              </div>

              <div className="mt-16 hidden lg:block">
                <ProductReviewsList />
              </div>
            </div>

            <div className="w-full flex flex-col items-start gap-5">
              <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between">
                <h2 className="text-[20px] blue-text font-bold">
                  {product?.name}
                </h2>
                <h3 className="text-[24px] font-bold">${product?.price}.00</h3>
              </div>

              <div className="w-full border" />

              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <div className="grid grid-cols-2 gap-y-3">
                  <p className="text-[13px] text-[#7C7C7C] font-medium">City</p>
                  <p className="text-[13px] font-medium">{product?.city}</p>
                  <p className="text-[13px] text-[#7C7C7C] font-medium">
                    Category
                  </p>
                  <p className="text-[13px] font-medium">{product?.category}</p>
                </div>
                <div className="grid grid-cols-2 gap-y-3">
                  <p className="text-[13px] text-[#7C7C7C] font-medium">
                    State
                  </p>
                  <p className="text-[13px] font-medium">{product?.state}</p>
                  <p className="text-[13px] text-[#7C7C7C] font-medium">
                    Sub Category
                  </p>
                  <p className="text-[13px] font-medium">
                    {product?.subCategory}
                  </p>
                </div>
              </div>

              <div className="w-full border" />

              <div className="w-full">
                <p className="text-[16px] text-[#003DAC] font-bold mb-3">
                  Description
                </p>
                <p className="text-[14px] font-normal">
                  {product?.description}
                </p>
              </div>

              <div className="w-full border" />

              <ProductSeller productData={product} />

              <div className="w-full border" />

              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleIncrementQuantity("decrement")}
                    className="py-3.5 px-6 rounded-l-[20px] text-center blue-bg"
                  >
                    <FaMinus className="text-lg text-white" />
                  </button>
                  <button
                    type="button"
                    disabled
                    className="py-[9px] px-10 w-full border-t border-b text-center bg-white text-black text-[18px] font-medium cursor-default"
                  >
                    {quantity}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleIncrementQuantity("increment")}
                    className="py-3.5 px-6 rounded-r-[20px] text-center blue-bg"
                  >
                    <FaPlus className="text-lg text-white" />
                  </button>
                </div>
                <div>
                  {addToCart ? (
                    <Link
                      to="/cart"
                      className="blue-bg text-white font-bold text-sm py-3.5 rounded-[20px] text-center w-full block"
                    >
                      View Cart
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={handleShowPopup}
                      className="blue-bg text-white font-bold text-sm py-3.5 rounded-[20px] text-center w-full"
                    >
                      {addToCart ? "View Cart" : " Add To Cart"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 lg:hidden">
            <ProductReviewsList />
          </div>
        </div>
      </div>
      <ChooseDeliveryModal
        showPopup={showPopup}
        handleShowPopup={handleShowPopup}
        handleSelectFulfillmentMethod={handleAddToCart}
      />
    </div>
  );
};

export default ProductDetails;
