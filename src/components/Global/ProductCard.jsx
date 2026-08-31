import React, { useContext, useState } from "react";
import { IoIosStar } from "react-icons/io";
import { FiHeart } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import { FaHeart } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import ProductRating from "./ProductRating";

const ProductCard = ({ product, fetchMyProducts }) => {
  // console.log("product >>>", product);
  const navigate = useNavigate();
  const { user, fetchUserProfile } = useContext(AuthContext);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const productAvgRating =
    (product?.avgRating?.oneStar * 1 +
      product?.avgRating?.twoStar * 2 +
      product?.avgRating?.threeStar * 3 +
      product?.avgRating?.fourStar * 4 +
      product?.avgRating?.fiveStar * 5) /
    (product?.avgRating?.oneStar +
      product?.avgRating?.twoStar +
      product?.avgRating?.threeStar +
      product?.avgRating?.fourStar +
      product?.avgRating?.fiveStar);
  const safeAvgRating = isNaN(productAvgRating) ? 0 : productAvgRating;

  const handleToggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const displayImage = product?.images?.find(
    (image) => image.displayImage === true
  );

  const handleNavigateToProductDetails = () => {
    navigate(`/products/${product?._id}`);
  };

  const handleAddToFavorite = async () => {
    // alert("Added favorite");
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
        console.log("product added favorite >>>>>", res);
        if (res?.status == 201) {
          fetchUserProfile();
          toast.success(res?.data?.message);
        }
      } catch (error) {
        console.log("product added favorite err >>>>>", error);
        if (error?.status === 409) {
          toast.error(error?.response?.data?.message);
        }
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
        console.log("product removed from favorite >>>>>", res);
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

  const handletoggleDeleteModal = (serviceId) => {
    setOpenDeleteModal(!openDeleteModal);
    setServiceToDelete(serviceId);
  };

  const handleBoostProduct = async () => {
    navigate("/choose-package-to-boost-service", {
      state: {
        from: window.location.href,
        id: product?._id,
        type: "product",
      },
    });
  };
  

  const hasDiscount =
    Boolean(product?.pricing?.discount) ||
    (product?.pricing?.discountedPrice !== undefined &&
      product?.pricing?.originalPrice !== undefined &&
      Number(product?.pricing?.discountedPrice) <
        Number(product?.pricing?.originalPrice));

  const discountType =
    product?.pricing?.discount?.type?.toUpperCase() ||
    (product?.pricing?.discountAmount ? "FIXED_AMOUNT" : "");

  const discountBadgeLabel =
    discountType === "PERCENTAGE"
      ? `${
          product?.pricing?.discount?.value ||
          Math.round(
            ((Number(product?.pricing?.originalPrice) -
              Number(product?.pricing?.discountedPrice)) /
              Number(product?.pricing?.originalPrice)) *
              100
          )
        }% OFF`
      : product?.pricing?.discountAmount || product?.pricing?.discount?.value
      ? `$${
          product?.pricing?.discountAmount || product?.pricing?.discount?.value
        } OFF`
      : hasDiscount &&
        product?.pricing?.originalPrice &&
        product?.pricing?.discountedPrice
      ? `${Math.round(
          ((Number(product?.pricing?.originalPrice) -
            Number(product?.pricing?.discountedPrice)) /
            Number(product?.pricing?.originalPrice)) *
            100
        )}% OFF`
      : "";

  const originalPrice =
    product?.pricing?.originalPrice !== undefined
      ? product.pricing.originalPrice
      : product?.price || "0.0";

  const finalPrice = hasDiscount
    ? product?.pricing?.discountedPrice
    : product?.price || "0.0";

  return (
    <div className="bg-white rounded-[20px] p-3 relative w-full custom-shadow cursor-pointer">
      <div className="w-full relative h-[276px] 2xl:h-[320px]">
        {/* Discount Badge in Vibrant Red */}
        {hasDiscount && (
          <div className="absolute z-10 top-4 left-4 bg-[#E53935] text-white text-xs font-extrabold px-3 py-1 rounded-lg shadow-lg tracking-wide flex items-center gap-1">
            <span>{discountBadgeLabel}</span>
          </div>
        )}

        {product?.seller === user?._id ? (
          <>
            <button
              type="button"
              onClick={handleToggleDropdown}
              className="absolute z-10 top-4 right-4 bg-white w-[34px] h-[34px] rounded-lg flex items-center justify-center"
            >
              <HiOutlineDotsVertical className="text-xl" />
            </button>
            {openDropdown && (
              <div className="w-[151px]  bg-white border absolute top-14 rounded-xl right-4 flex flex-col items-start justify-center p-5 gap-1">
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

                {product?.boostPlan?.name === "No Plan" && (
                  <button
                    type="button"
                    className="font-medium"
                    onClick={handleBoostProduct}
                  >
                    Boost Post
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <button
            type="button"
            className="absolute z-10 top-4 right-4"
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
          alt="product"
          className="w-full h-[276px] 2xl:h-[320px] object-cover rounded-[15px]"
          onClick={handleNavigateToProductDetails}
        />
      </div>
      <div className="w-full" onClick={handleNavigateToProductDetails}>
        <h4 className="mt-2 font-semibold text-base text-gray-900 truncate" title={product?.name}>
          {product?.name}
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
            {product?.fulfillmentMethod?.selfPickup ? "Pickup" : "Delivery"}
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
        <div className="w-full flex items-center justify-between">
          <ProductRating productAvgRating={safeAvgRating} />
          <div className="flex items-center gap-2">
            <div className="flex items-baseline gap-1.5">
              <p
                className={`text-[19px] font-bold ${
                  hasDiscount ? "text-[#E53935]" : "blue-text"
                }`}
              >
                $
                {Number(finalPrice) % 1 === 0
                  ? `${Number(finalPrice)}.00`
                  : finalPrice}
              </p>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through font-medium">
                  $
                  {Number(originalPrice) % 1 === 0
                    ? `${Number(originalPrice)}.00`
                    : originalPrice}
                </span>
              )}
            </div>
            {hasDiscount && (
              <span className="bg-red-50 text-[#E53935] border border-red-200 text-[10px] font-extrabold px-1.5 py-0.5 rounded tracking-wider">
                {discountType === "PERCENTAGE" ? "% OFF" : "FIXED"}
              </span>
            )}
          </div>
        </div>
      </div>
      <DeleteServiceModal
        showDeleteModal={openDeleteModal}
        onclose={handletoggleDeleteModal}
        serviceToDelete={serviceToDelete}
        user={user}
        fetchMyServices={fetchMyProducts}
      />
    </div>
  );
};

export default ProductCard;

const DeleteServiceModal = ({
  showDeleteModal,
  onclose,
  serviceToDelete,
  user,
  fetchMyServices,
}) => {
  const handleDeleteService = async () => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/users/product/${serviceToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      // console.log("delete service res >>>", res);
      if (res?.status == 200) {
        toast.success(res?.data?.message);
        fetchMyServices();
        onclose();
      }
    } catch (error) {
      console.log(
        "error while deleting service >>>",
        error?.response?.data?.message
      );
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    showDeleteModal && (
      <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.2)] flex items-center justify-center">
        <div className="bg-white p-5 w-full lg:w-[330px] h-[133px] flex flex-col items-start justify-center gap-1 rounded-2xl relative">
          <button
            type="button"
            onClick={onclose}
            className="w-5 h-5 rounded-full bg-gray-200 absolute top-5 right-5 p-1"
          >
            <IoClose className="w-full h-full" />
          </button>
          <p className="font-semibold text-[17px]">Delete Post</p>
          <p className="text-[15px]">Are you sure you want to delete post?</p>
          <div className="w-full flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => handleDeleteService()}
              className="text-[13px] font-semibold text-[#FF3B30]"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={onclose}
              className="text-[13px] font-semibold text-[#000]"
            >
              No
            </button>
          </div>
        </div>
      </div>
    )
  );
};
