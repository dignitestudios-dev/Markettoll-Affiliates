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
                className="w-full h-auto lg:h-[376px] object-cover rounded-xl"
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
                <h2 className="text-[20px] blue-text font-bold">
                  {product?.name}
                </h2>
                <div className="flex items-center justify-end gap-4">
                  <h3 className="text-[24px] font-bold">
                    ${product?.price}.00
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
