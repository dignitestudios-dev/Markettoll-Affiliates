import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { IoIosStar } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";

const ServiceDetailsPage = () => {
  const [service, setService] = useState(null);
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const { user } = useContext(AuthContext);
  const [displayImage, setDisplayImage] = useState(null);

  const handleFetchService = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/service/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      console.log("service details >>>>", res?.data?.data);
      setService(res?.data?.data);
    } catch (error) {
      console.log("service details err >>>", error);
    }
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

  const handleAddService = () => {
    navigate("/boost-service");
  };

  return (
    <div className="padding-x py-6 w-full">
      <div className="w-full bg-[#F7F7F7]">
        <div className="w-full bg-white px-4 md:px-8 lg:px-12 py-12 rounded-[30px]">
          <div className="w-full flex flex-col lg:flex-row justify-start gap-x-8 gap-y-6">
            <div className="w-full">
              <img
                src={displayImage?.url}
                alt="product image"
                className="w-full h-auto lg:h-[376px] object-cover rounded-xl"
              />
              <div className="w-full max-h-[109px] flex items-start mt-3 gap-3 overflow-x-scroll scrollbar-hide">
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
                <h3 className="text-[24px] font-bold">${service?.price}.00</h3>
              </div>

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
                        className="w-[68px] h-[68px]"
                      />
                      <div className="flex flex-col items-start">
                        <span className="text-[#676767] text-[13px] font-normal">
                          Posted By
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[18px] font-medium">
                            {service?.sellerDetails?.name}{" "}
                          </span>
                          <span className="flex items-center gap-1">
                            <IoIosStar className="text-yellow-400" /> 4.8
                          </span>
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
                    <Link
                      to="/chats"
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
                    </Link>
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
