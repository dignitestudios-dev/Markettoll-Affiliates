import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { IoIosStar } from "react-icons/io";
import { FaHeart, FaMinus, FaPlus } from "react-icons/fa6";
import ProductReviewsList from "./ProductReviewsList";
import ChooseDeliveryModal from "./ChooseDeliveryModal";
import { FiHeart } from "react-icons/fi";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import ProductSeller from "./ProductSeller";
import { HiOutlineDotsVertical } from "react-icons/hi";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper type
import { Swiper as SwiperType } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Thumbs } from "swiper/modules";
import { CartProductContext } from "../../context/cartProductContext";
import Loader from "../Global/Loader";
import ButtonLoader from "../Global/ButtonLoader";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [addToCart, setAddToCart] = useState(false);
  const { fetchCartProducts } = useContext(CartProductContext);
  const { productId } = useParams();
  const { user, userProfile, fetchUserProfile } = useContext(AuthContext);
  const [displayImage, setDisplayImage] = useState(null);
  const [fulfillmentMethod, setFulfillmentMethod] = useState({
    selfPickup: null,
    delivery: null,
  });
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [incrementingQty, setIncrementingQty] = useState(false);
  const [decrementingQty, setDecrementingQty] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleToggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleShowPopup = () => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }
    setShowPopup(!showPopup);
  };

  const handleAddToCart = async (method) => {
    if (!user) {
      toast.error("You must be logged in to add product in cart");
      return;
    }

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
      fetchCartProducts();
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
    const config = user?.token
      ? `${BASE_URL}/users/product/${productId}`
      : `${BASE_URL}/users/product/${productId}`;
    try {
      setLoading(true);
      if (user?.token) {
        const res = await axios.get(`${BASE_URL}/users/product/${productId}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setProduct(res?.data?.data);
      } else {
        const res = await axios.get(`${BASE_URL}/users/product/${productId}`);
        setProduct(res?.data?.data);
      }
    } catch (error) {
      if (error?.status === 404) {
        toast.error(error?.response?.data?.message);
        setNotFound(true);
      }
      console.log("product err >>>", error);
    } finally {
      setLoading(false);
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
    if (!user) {
      toast.error("You must be logged in");
      return;
    }
    if (quantity === product?.quantity) {
      toast.error("No more quantity available");
      return;
    }
    const endpoint =
      type === "increment"
        ? `${BASE_URL}/users/cart-product-increment-by-one/${productId}`
        : `${BASE_URL}/users/cart-product-decrement-by-one/${productId}`;
    if (type === "increment") {
      setIncrementingQty(true);
    } else {
      setDecrementingQty(true);
    }
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
      // console.log("increment by one res >>>>>>", res);
      if (res.status == 200) {
        setQuantity(res?.data?.data?.quantity);
      }
    } catch (error) {
      // console.log("decrement by one err >>>>>>", error);
      toast.error(error?.response?.data?.message);
    } finally {
      if (type === "increment") {
        setIncrementingQty(false);
      } else {
        setDecrementingQty(false);
      }
    }
  };

  const handleAddToFavorite = async () => {
    // alert("Added favorite");
    if (!user) {
      toast.error("You must be logged in");
      return;
    }
    if (user?.token) {
      try {
        const res = await axios.post(
          `${BASE_URL}/users/wishlist-product/${product?._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        // console.log("product added favorite >>>>>", res);
        if (res?.status == 201) {
          toast.success(res?.data?.message);
          fetchUserProfile();
          handleFetchProduct();
        }
      } catch (error) {
        // console.log("product added favorite err >>>>>", error);
        // if (error?.status === 409) {
        toast.error(error?.response?.data?.message);
        // }
      }
    } else {
      navigate("/login");
    }
  };

  const handleRemoveFromFavorite = async () => {
    if (user?.token) {
      try {
        const res = await axios.delete(
          `${BASE_URL}/users/wishlist-product/${product?._id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        // console.log("product removed from favorite >>>>>", res);
        if (res?.status == 200) {
          fetchUserProfile();
          toast.success(res?.data?.message);
        }
      } catch (error) {
        console.log("product removed from favorite err >>>>>", error);
        if (error?.status === 409) {
          toast.error(error?.response?.data?.message);
        }
      }
    } else {
      navigate("/login");
    }
  };

  if (loading) {
    return <Loader />;
  }
  if (incrementingQty || decrementingQty) {
    return <Loader />;
  }

  if (notFound) {
    return (
      <div className="w-full h-screen flex flex-1 items-center justify-center">
        <h2>Oops! Something went wrong.</h2>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <div className="w-full p-4 rounded-[30px] bg-[#F7F7F7]">
        <div className="w-full p-6 rounded-[30px] bg-[#ffff]">
          <Link to="/" className="flex items-center gap-1 mb-5 w-20">
            <GoArrowLeft className="text-xl" />
            <span className="font-medium text-sm text-[#5C5C5C]">Back</span>
          </Link>
          <div className="w-full flex flex-col lg:flex-row justify-start gap-x-8 gap-y-6">
            <div className="w-full relative lg:max-w-1/2">
              {product?.seller !== userProfile?._id && (
                <button
                  type="button"
                  className="absolute z-10 top-5 right-5"
                  onClick={() =>
                    product?.isWishListed
                      ? handleRemoveFromFavorite()
                      : handleAddToFavorite()
                  }
                >
                  {product?.isWishListed ? (
                    <FaHeart className="text-white text-2xl" />
                  ) : (
                    <FiHeart className="text-white text-2xl" />
                  )}
                </button>
              )}
              <img
                src={displayImage?.url}
                alt="product image"
                className="w-full h-auto lg:h-[376px] object-contain rounded-xl bg-gray-100"
              />
              <div className="w-full overflow-x-scroll flex items-start gap-5 mt-3 thumbnail-scroll">
                {product?.images?.map((image, index) => {
                  return (
                    <img
                      key={index}
                      src={image?.url}
                      alt={`Thumbnail ${index + 1}`}
                      className={`rounded-xl h-[97px] w-[120px] object-cover cursor-pointer ${
                        image?.url === displayImage?.url
                          ? "border-2 border-blue-500"
                          : ""
                      } `}
                      onClick={() => handleThumbnailClick(image)}
                    />
                  );
                })}
              </div>

              <div className="mt-16 hidden lg:block">
                <ProductReviewsList avgRating={product?.avgRating} />
              </div>
            </div>

            <div className="w-full flex flex-col items-start gap-5 lg:max-w-1/2">
              <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between">
                <div className="flex flex-wrap items-center gap-5">
                  <h2 className="text-[20px] blue-text font-bold">
                    {product?.name}
                  </h2>

                  {product?.boostPlan?.transactionId &&
                    product?.boostPlan?.name !== "No Plan" && (
                      <div className="flex gap-2 items-center bg-[#00AAD51F] text-[#00AAD5] rounded-full py-2 px-3.5">
                        Boosted
                        <>
                          <svg
                            width={20}
                            height={20}
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                          >
                            <rect
                              width={20}
                              height={20}
                              fill="url(#pattern0_951_15999)"
                            />
                            <defs>
                              <pattern
                                id="pattern0_951_15999"
                                patternContentUnits="objectBoundingBox"
                                width={1}
                                height={1}
                              >
                                <use
                                  xlinkHref="#image0_951_15999"
                                  transform="scale(0.00195312)"
                                />
                              </pattern>
                              <image
                                id="image0_951_15999"
                                width={512}
                                height={512}
                                preserveAspectRatio="none"
                                xlinkHref="data:image/png;base64,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"
                              />
                            </defs>
                          </svg>
                        </>
                      </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-4">
                  <h3 className="text-[24px] font-bold">
                    $
                    {String(product?.price)?.includes(".")
                      ? product?.price
                      : `${product?.price}.00`}
                  </h3>
                  {product?.seller === userProfile?._id && (
                    <>
                      <button
                        type="button"
                        onClick={handleToggleDropdown}
                        className=" z-10 bg-white w-[34px] h-[34px] rounded-lg flex items-center justify-center"
                      >
                        <HiOutlineDotsVertical className="text-xl" />
                      </button>
                      {openDropdown && (
                        <div className="w-[151px] h-[122px] bg-white border absolute top-32 rounded-xl right-14 flex flex-col items-start justify-center p-5 gap-1">
                          <Link
                            to={`/edit-product/${product?._id}`}
                            className="font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="font-medium"
                            onClick={() => handletoggleDeleteModal(product._id)}
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            className="font-medium"
                            onClick={() => handleBoostProduct()}
                          >
                            Boost Post
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
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

              <div className="w-full text-wrap">
                <p className="text-[16px] text-[#003DAC] font-bold mb-3">
                  Description
                </p>
                <p className="text-[14px] font-normal text-wrap product-description">
                  {product?.description}
                </p>
              </div>

              <div className="w-full border" />

              <ProductSeller productData={product} />

              <div className="w-full border" />

              {/* quantity buttons */}
              {product?.seller !== userProfile?._id && (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      disabled={product?.quantity == 0}
                      onClick={() => handleIncrementQuantity("decrement")}
                      className={`py-3.5 px-6 rounded-l-[20px] text-center blue-bg disabled:cursor-not-allowed`}
                    >
                      <FaMinus className="text-lg text-white" />
                    </button>
                    <button
                      type="button"
                      disabled
                      className="py-[9px] px-10 w-full border-t border-b text-center bg-white text-black text-[18px] font-medium cursor-default"
                    >
                      {product?.quantity == 0 ? 0 : quantity}
                    </button>
                    <button
                      type="button"
                      disabled={product?.quantity == 0}
                      onClick={() => handleIncrementQuantity("increment")}
                      className={`py-3.5 px-6 rounded-r-[20px] text-center blue-bg disabled:cursor-not-allowed`}
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
                        disabled={product?.quantity == 0}
                        onClick={handleShowPopup}
                        className={`blue-bg text-white font-bold text-sm py-3.5 rounded-[20px] text-center w-full ${
                          product?.quantity == 0 && "cursor-not-allowed"
                        }`}
                      >
                        {product?.quantity == 0
                          ? "Out of Stock"
                          : addToCart
                          ? "View Cart"
                          : " Add To Cart"}
                        {/* {addToCart ? "View Cart" : " Add To Cart"} */}
                      </button>
                    )}
                  </div>
                </div>
              )}
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
