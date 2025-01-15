import React, { useContext, useEffect, useRef, useState } from "react";
import Loader from "../Global/Loader";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import ServiceCard from "../Global/ServiceCard";
import { FiHeart } from "react-icons/fi";
import { IoIosStar } from "react-icons/io";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

const MyServicesList = ({ postType }) => {
  const [myServices, setMyServices] = useState([]);
  const { user, userProfile } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const handletoggleDeleteModal = (serviceId) => {
    setOpenDeleteModal(!openDeleteModal);
    setServiceToDelete(serviceId);
  };

  const toggleDropdown = (serviceId) => {
    setOpenDropdownId(openDropdownId === serviceId ? null : serviceId);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpenDropdownId(null); // Close dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchMyServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        postType === "Post"
          ? `${BASE_URL}/users/seller-services/${user?._id}?page=${page}`
          : `${BASE_URL}/users/services-boosted?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      // console.log(res?.data);
      setMyServices(res?.data?.data);
    } catch (error) {
      // console.log("my services err >>>>", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyServices();
  }, [postType]);

  if (loading) {
    return <Loader />;
  }

  const handleNavigateToProductDetails = (id) => {
    navigate(`/services/${id}`);
  };

  const handleNavigateToBostPost = (serviceId) => {
    navigate("/choose-package-to-boost-service", {
      state: { from: window.location.href, id: serviceId, type: "service" },
    });
  };

  const handleNavigateToEdit = (id) => {
    navigate(`/services/edit-service/${id}`, {
      state: { from: "/account/my-listings" },
    });
  };

  return (
    <div className="w-full min-h-[50vh]">
      {myServices.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-10">
          {myServices?.map((service, index) => {
            return (
              <div
                key={index}
                className="bg-white rounded-[20px] p-3 relative w-full custom-shadow cursor-pointer"
              >
                <div className="w-full relative h-[276px]">
                  {userProfile?._id === user?._id ? (
                    <>
                      <button
                        type="button"
                        ref={buttonRef}
                        onClick={() => toggleDropdown(service._id)}
                        className="absolute z-10 top-4 right-2 flex justify-center items-center shadow w-[34px] h-[34px] bg-white rounded-[10px]"
                      >
                        <HiOutlineDotsVertical className="text-black text-2xl" />
                      </button>
                      {openDropdownId === service._id && (
                        <div
                          ref={dropdownRef}
                          className="absolute z-20 bg-white shadow-lg w-[151px] h-[122px] top-14 right-8 rounded-xl flex flex-col items-start p-5 justify-center gap-2"
                        >
                          <button
                            type="button"
                            onClick={() => handleNavigateToEdit(service?._id)}
                            className="font-medium text-base"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handletoggleDeleteModal(service._id)}
                            className="font-medium text-base"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() =>
                              handleNavigateToBostPost(service._id)
                            }
                            type="button"
                            className="font-medium text-base"
                          >
                            Boost Post
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      className="absolute z-10 top-4 right-4"
                    >
                      <FiHeart className="text-white text-2xl" />
                    </button>
                  )}

                  <img
                    src={service?.images[0]?.url}
                    alt="product"
                    className="w-full h-[276px]"
                    onClick={() => handleNavigateToProductDetails(service?._id)}
                  />
                </div>
                <div
                  className="w-full"
                  onClick={() => handleNavigateToProductDetails(service?._id)}
                >
                  <h4 className="mt-2.5 font-medium text-base">
                    {service?.name}
                  </h4>
                  <div className="w-full flex items-center justify-center mt-1">
                    <div className="flex items-center gap-1 w-full">
                      {/* <IoIosStar className="text-yellow-400 text-lg" />
                      <span className="text-base text-[#606060] font-medium">
                        4.3
                      </span> */}
                    </div>
                    <p className="text-[18px] font-bold blue-text">
                      ${service?.price}.00
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full">
          <h2 className="font-bold blue-text text-lg px-2 mt-10">
            You have not posted any service.
          </h2>
        </div>
      )}
      <DeleteServiceModal
        showDeleteModal={openDeleteModal}
        onclose={handletoggleDeleteModal}
        serviceToDelete={serviceToDelete}
        user={user}
        fetchMyServices={fetchMyServices}
      />
    </div>
  );
};

export default MyServicesList;

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
        `${BASE_URL}/users/service/${serviceToDelete}`,
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
      // console.log(
      //   "error while deleting service >>>",
      //   error?.response?.data?.message
      // );
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
