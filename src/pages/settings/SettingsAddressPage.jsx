import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import SettingsAddressDeleteModal from "../../components/Settings/SettingsAddressDeleteModal";
import { AuthContext } from "../../context/authContext";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
  LanguageSelect,
  RegionSelect,
  PhonecodeSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

const SettingsAddressPage = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);

  const handleShowDeleteModal = () => {
    setShowModal(!showModal);
  };

  const handleAddressChange = (address) => {
    setSelectedAddress(address);
  };

  return (
    <div className="w-full px-5">
      <SettingsAddressDeleteModal
        showModal={showModal}
        onclose={handleShowDeleteModal}
      />
      <h2 className="font-bold text-[28px] blue-text">Addresses</h2>
      <div className="w-full border mt-5 mb-4" />

      <div className="w-full flex flex-col items-start gap-4">
        <div className="w-full">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center mb-1">
              <input
                id="homeAddress"
                type="radio"
                checked={selectedAddress === "homeAddress"}
                onChange={() => handleAddressChange("homeAddress")}
                name="address"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
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
            {user?.address?.city}, {user?.address?.state},{" "}
            {user?.address?.country}
          </div>
        </div>

        <div className="w-full">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center mb-1">
              <input
                id="pickupAddress1"
                type="radio"
                checked={selectedAddress === "pickupAddress1"}
                onChange={() => handleAddressChange("pickupAddress1")}
                name="address"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor="pickupAddress1"
                className="ms-2 text-sm font-medium text-gray-900"
              >
                Pickup Address
              </label>
            </div>
            <Link
              to="/settings/addresses/edit-addresses"
              className="text-sm font-medium"
            >
              Edit
            </Link>
          </div>
          <div className="w-full bg-[#F5F5F5] text-sm px-5 py-3 rounded-2xl">
            Unit 500, Montford Court, Montford Street, Salford, M50 2QP - 123456
          </div>
        </div>

        <div className="w-full">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center mb-1">
              <input
                id="pickupAddress2"
                type="radio"
                checked={selectedAddress === "pickupAddress2"}
                onChange={() => handleAddressChange("pickupAddress2")}
                name="address"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor="pickupAddress2"
                className="ms-2 text-sm font-medium text-gray-900"
              >
                Delivery Address
              </label>
            </div>
            <div className="flex items-center justify-end gap-3">
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
            </div>
          </div>
          <div className="w-full bg-[#F5F5F5] text-sm px-5 py-3 rounded-2xl">
            Unit 500, Montford Court, Montford Street, Salford, M50 2QP - 123456
          </div>
        </div>

        <div className="">
          <Link
            to="/settings/addresses/add-addresses"
            className="flex items-center justify-start gap-1 text-[15px] font-medium"
          >
            <span className="light-blue-text">+</span> Add new delivery address
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SettingsAddressPage;
