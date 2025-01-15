import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SettingsAddressDeleteModal from "../../components/Settings/SettingsAddressDeleteModal";
import { AuthContext } from "../../context/authContext";

const SettingsAddressPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { userProfile } = useContext(AuthContext);
  const [addressId, setAddressId] = useState(null);
  const navigate = useNavigate();

  const handleShowDeleteModal = async (id) => {
    setShowModal(!showModal);
    setAddressId(id);
  };

  const handleNavigateToEdit = (id, type, data) => {
    navigate(`/settings/addresses/edit-addresses/${id}`, {
      state: { from: window.location.href, type: type, data },
    });
  };

  return (
    <div className="w-full px-5">
      <SettingsAddressDeleteModal
        showModal={showModal}
        onclose={handleShowDeleteModal}
        id={addressId}
      />
      <h2 className="font-bold text-[28px] blue-text">Addresses</h2>
      <div className="w-full border mt-5 mb-4" />

      <div className="w-full flex flex-col items-start gap-4">
        <div className="w-full">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center mb-1">
              <label
                htmlFor="homeAddress"
                className="ms-2 text-sm font-medium text-gray-900"
              >
                My Location
              </label>
            </div>
            <Link
              to="/settings/edit-home-adress"
              className="text-sm font-medium"
            >
              Edit
            </Link>
          </div>
          <div className="w-full bg-[#F5F5F5] text-sm px-5 py-3 rounded-2xl">
            {userProfile?.address?.city}, {userProfile?.address?.state},{" "}
            {userProfile?.address?.country}{" "}
            {userProfile?.address?.zipCode &&
              `- ${userProfile?.address?.zipCode}`}
          </div>
        </div>

        <div className="w-full">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center mb-1">
              <label
                htmlFor="pickupAddress1"
                className="ms-2 text-sm font-medium text-gray-900"
              >
                Pickup Address
              </label>
            </div>
            <button
              type="button"
              onClick={() =>
                handleNavigateToEdit(
                  userProfile?.pickupAddress?._id,
                  "pickupAddress",
                  userProfile?.pickupAddress
                )
              }
              // to={`/settings/addresses/edit-addresses/${userProfile?.pickupAddress?._id}`}
              className="text-sm font-medium"
            >
              {userProfile?.pickupAddress?.state ? "Edit" : "Add"}
            </button>
          </div>
          {userProfile?.pickupAddress?.state ? (
            <div className="w-full bg-[#F5F5F5] text-sm px-5 py-3 rounded-2xl">
              {userProfile?.apartment_suite} {userProfile?.pickupAddress?.city},{" "}
              {userProfile?.pickupAddress?.streetAddress},{" "}
              {userProfile?.pickupAddress?.state},{" "}
              {userProfile?.pickupAddress?.country}{" "}
              {userProfile?.pickupAddress?.zipCode &&
                `- ${userProfile?.pickupAddress?.zipCode}`}
            </div>
          ) : (
            <div className="w-full bg-[#F5F5F5] text-sm px-5 py-3 rounded-2xl">
              N/A
            </div>
          )}
        </div>

        <div className="w-full">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center mb-1">
              <label
                htmlFor="pickupAddress2"
                className="ms-2 text-sm font-medium text-gray-900"
              >
                Delivery Address
              </label>
            </div>
            {/* <div className="flex items-center justify-end gap-3">
              <Link
                to="/settings/addresses/edit-addresses"
                className="text-sm font-medium"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={handleShowDeleteModal}
                className="text-sm font-medium text-[#FB3838]"
              >
                Delete
              </button>
            </div> */}
          </div>
          {userProfile?.deliveryAddresses?.length > 0 ? (
            <>
              {userProfile?.deliveryAddresses?.map((address, index) => {
                return (
                  <div className="mb-1">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleNavigateToEdit(
                            address?._id,
                            "deliveryAddress",
                            address
                          )
                        }
                        // to={`/settings/addresses/edit-addresses/${address?._id}`}
                        className="text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleShowDeleteModal(address?._id)}
                        className="text-sm font-medium text-[#FB3838]"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="w-full flex items-center gap-1" key={index}>
                      <div className="w-full bg-[#F5F5F5] text-sm px-5 py-3 rounded-2xl">
                        {address?.apartment_suite} {address?.streetAddress},{" "}
                        {address?.state}, {address?.country}{" "}
                        {address?.zipCode && `- ${address?.zipCode}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <></>
          )}
          {userProfile?.deliveryAddresses.length < 3 && (
            <div className="">
              <Link
                to="/settings/addresses/add-addresses"
                className="flex items-center justify-start gap-1 text-[15px] font-medium"
              >
                <span className="light-blue-text">+</span> Add new delivery
                address
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsAddressPage;
