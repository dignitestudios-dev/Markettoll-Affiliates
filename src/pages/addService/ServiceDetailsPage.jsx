import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { IoIosStar } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import ProductRating from "../../components/Global/ProductRating";
import { GoArrowLeft } from "react-icons/go";
import { FaHeart } from "react-icons/fa6";
import { FiHeart } from "react-icons/fi";
import { toast } from "react-toastify";
import ServiceSellerAndRatings from "./ServiceSellerAndRatings";
import Loader from "../../components/Global/Loader";
import { HiOutlineDotsVertical } from "react-icons/hi";
import DeleteServiceModal from "./DeleteServiceModal";

const ServiceDetailsPage = () => {
  const [service, setService] = useState(null);
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const { user } = useContext(AuthContext);
  const [displayImage, setDisplayImage] = useState(null);
  const { userProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openDeleteMoal, setOpenDeleteModal] = useState(false);

  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleFetchService = async () => {
    setLoading(true);
    const headers = user?.token
      ? { Authorization: `Bearer ${user?.token}` }
      : {};
    try {
      const res = await axios.get(`${BASE_URL}/users/service/${serviceId}`, {
        headers: headers,
      });
      // console.log("service details >>>>", res?.data?.data);
      setService(res?.data?.data);
    } catch (error) {
      // console.log("service details err >>>", error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const navigateToBoostPost = () => {
    navigate("/choose-package-to-boost-service", {
      state: { id: serviceId, type: "edit-service" },
    });
  };

  useEffect(() => {
    handleFetchService();
  }, []);

  useEffect(() => {
    if (service?.images?.length > 0) {
      const defaultDisplayImage =
        service.images.find((image) => image.displayImage === true) ||
        service.images[0];
      setDisplayImage(defaultDisplayImage);
    }
  }, [service]);

  const handleThumbnailClick = (image) => {
    setDisplayImage(image);
  };

  const userDetail = {
    id: service?.sellerDetails?._id,
    lastMessage: {
      profileImage: service?.sellerDetails?.profileImage,
      profileName: service?.sellerDetails?.name,
      id: service?.sellerDetails?._id,
    },
  };

  const productAvgRating =
    (service?.avgRating?.oneStar * 1 +
      service?.avgRating?.twoStar * 2 +
      service?.avgRating?.threeStar * 3 +
      service?.avgRating?.fourStar * 4 +
      service?.avgRating?.fiveStar * 5) /
    (service?.avgRating?.oneStar +
      service?.avgRating?.twoStar +
      service?.avgRating?.threeStar +
      service?.avgRating?.fourStar +
      service?.avgRating?.fiveStar);
  const safeAvgRating = isNaN(productAvgRating) ? 0 : productAvgRating;

  const addServiceToWishlist = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/users/wishlist-service/${serviceId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      // console.log("service add to wishlist res >>>>", res);
      if (res?.status === 201) {
        toast.success(res?.data?.message || "Service added to wishlist");
        handleFetchService();
      }
    } catch (error) {
      // console.log("err while adding servie to wishlist >>>", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleRemoveFromFavorite = async () => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/users/wishlist-service/${serviceId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      // console.log("service removed from wishlist res >>>>", res);
      if (res?.status === 200) {
        toast.success(res?.data?.message || "Service removed from wishlist");
        handleFetchService();
      }
    } catch (error) {
      // console.log("err while removing servie from wishlist >>>", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const toggleDeleteModal = () => {
    setOpenDeleteModal(!openDeleteMoal);
    if (openDropdown) {
      toggleDropdown();
    }
  };

  const deleteService = async () => {
    try {
      const res = await axios.delete(`${BASE_URL}/users/service/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      // console.log("delete service res >>>>", res);
      if (res?.status === 200) {
        toggleDeleteModal();
        toast.success("Service deleted succesfully.");
        navigate("/");
      }
    } catch (error) {
      // console.log("err while deleting service >>>", error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    }
  };

  const handleNavigateToChat = () => {
    if (user) {
      navigate(`/chats`, { state: { data: userDetail } });
    } else {
      toast.error("Please login to chat with the seller");
      navigate("/login");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="padding-x py-6 w-full">
      <DeleteServiceModal
        ondelete={deleteService}
        onclose={toggleDeleteModal}
        state={openDeleteMoal}
      />
      <div className="w-full bg-[#F7F7F7] p-5 rounded-[30px]">
        <div className="w-full bg-white px-4 md:px-4 lg:px-6 py-6 rounded-[30px]">
          <Link to="/" className="flex items-center gap-1 mb-5 w-20">
            <GoArrowLeft className="text-xl" />
            <span className="font-medium text-sm text-[#5C5C5C]">Back</span>
          </Link>
          <div className="w-full flex flex-col lg:flex-row justify-start gap-x-8 gap-y-6">
            <div className="w-full relative">
              {service?.seller !== userProfile?._id && (
                <button
                  type="button"
                  className="absolute z-10 top-5 right-5"
                  onClick={() =>
                    service?.isWishListed
                      ? handleRemoveFromFavorite()
                      : addServiceToWishlist()
                  }
                >
                  {service?.isWishListed ? (
                    <FaHeart className="text-gray-300 text-2xl" />
                  ) : (
                    <FiHeart className="text-gray-300 text-2xl" />
                  )}
                </button>
              )}
              <img
                src={displayImage?.url}
                alt="product image"
                className="w-full h-auto lg:h-[376px] object-cover rounded-xl"
              />
              <div className="w-full max-h-[109px] overflow-x-scroll flex items-start gap-5 mt-6 thumbnail-scroll">
                {service?.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image?.url}
                    alt={`Thumbnail ${index + 1}`}
                    className={`rounded-xl h-[97px] w-[120px] object-cover cursor-pointer ${
                      image?.url === displayImage?.url
                        ? "border-2 border-blue-500"
                        : ""
                    }`}
                    onClick={() => handleThumbnailClick(image)}
                  />
                ))}
              </div>
            </div>

            <div className="w-full flex flex-col items-start gap-5">
              <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between">
                <h2 className="text-[20px] blue-text font-bold">
                  {service?.name}
                </h2>
                <div className="flex items-center justify-end gap-4 relative">
                  <h3 className="text-[24px] font-bold">
                    ${service?.price}.00
                  </h3>
                  {service?.seller === user?._id && (
                    <button type="button" onClick={toggleDropdown}>
                      <HiOutlineDotsVertical className="text-xl text-gray-700" />
                    </button>
                  )}
                  {openDropdown && (
                    <div className="bg-white shadow py-3.5 rounded-xl w-auto h-auto absolute top-8 right-3 z-10 flex flex-col items-start gap-1">
                      <Link
                        to={`/services/edit-service/${serviceId}`}
                        className="w-full px-4 text-start text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleDeleteModal()}
                        className="w-full px-4 text-start text-sm font-medium"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={navigateToBoostPost}
                        className="w-full px-4 text-start text-sm font-medium"
                      >
                        Boost Post
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="border w-full" />

              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <div className="grid grid-cols-2 gap-y-3">
                  <p className="text-[13px] text-[#7C7C7C] font-medium">City</p>
                  <p className="text-[13px] font-medium">{service?.city}</p>
                </div>
                <div className="grid grid-cols-2 gap-y-3">
                  <p className="text-[13px] text-[#7C7C7C] font-medium">
                    State
                  </p>
                  <p className="text-[13px] font-medium">{service?.state}</p>
                </div>
              </div>
              <div className="border w-full" />

              <div className="w-full">
                <p className="text-[16px] text-[#003DAC] font-bold mb-3">
                  Description
                </p>
                <p className="text-[14px] font-normal">
                  {service?.description}
                </p>

                <div className="w-full mt-4 flex items-center justify-between">
                  <div className="w-full">
                    <p className="blue-text text-sm font-bold mb-3">Seller</p>
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          service?.sellerDetails?.profileImage == ""
                            ? "/seller-profile-img.png"
                            : service?.sellerDetails?.profileImage
                        }
                        alt="seller profile image"
                        className="w-[68px] h-[68px] rounded-full object-cover"
                      />
                      <div className="flex flex-col items-start">
                        <span className="text-[#676767] text-[13px] font-normal">
                          Posted By
                        </span>
                        <div className="flex items-center gap-2">
                          <p className="text-[16px] font-medium min-w-20">
                            {service?.sellerDetails?.name}{" "}
                          </p>
                          <ServiceSellerAndRatings serviceData={service} />
                        </div>
                        <Link
                          to={`/seller-profile/${service?.sellerDetails?._id}`}
                          className="text-[13px] font-semibold underline"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handleNavigateToChat}
                      // to="/chats"
                      // state={{ data: userDetail }}
                      className="flex items-center justify-end gap-2 w-[127px]"
                    >
                      <img
                        src="/chat-icon.png"
                        alt="chat icon"
                        className="w-[18px] h-[18px]"
                      />
                      <span className="text-[13px] text-[#676767] block">
                        Chat With Seller
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
