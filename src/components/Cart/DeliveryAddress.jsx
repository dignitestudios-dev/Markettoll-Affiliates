import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { FiPlus } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { STATES } from "../../constants/states";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { toast } from "react-toastify";

const DeliveryAddress = ({ onclick }) => {
  const [state, setState] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { user } = useContext(AuthContext);
  const handleAddressSelect = (address) => {
    setSelectedAddress(address); // set selected address object
  };
  console.log("selectedAddress >>>>>", selectedAddress);
  const handleState = () => {
    setState(!state);
  };
  return (
    <div className="bg-white rounded-[20px] p-6">
      <div>
        <button
          type="button"
          onClick={onclick}
          className="flex items-center gap-1"
        >
          <GoArrowLeft className="text-xl light-blue-text" />
          <span className="text-sm font-medium text-gray-500">Black</span>
        </button>
      </div>
      <h2 className="text-[28px] font-bold blue-text">Delivery Address</h2>

      {!user?.deliveryAddresses || user?.deliveryAddresses.length === 0 ? (
        <button
          type="button"
          onClick={handleState}
          className="text-[15px] font-medium flex items-center my-5"
        >
          <FiPlus className="light-blue-text" /> Add new delivery address
        </button>
      ) : (
        <div className="flex flex-col items-start gap-3 mt-5">
          {user?.deliveryAddresses?.map((address, index) => {
            return (
              <div className="flex items-center gap-2" key={index}>
                <input
                  type="radio"
                  name="address1"
                  id="address1"
                  className="w-5 h-5"
                  value={address?.streetAddress} // Optional: you can set value as streetAddress or id
                  onChange={() => handleAddressSelect(address)} // Update selected address
                  checked={
                    selectedAddress?.streetAddress === address?.streetAddress
                  }
                />
                <label
                  htmlFor={`address-${index}`}
                  className="bg-[#F5F5F5] rounded-[20px] px-5 py-3.5 text-sm"
                >
                  {address?.streetAddress} {address?.apartment_suite}{" "}
                  {address?.state} {address?.city} United States{" "}
                  {address?.zipCode}
                </label>
              </div>
            );
          })}
        </div>
      )}

      <AddAddressModal state={state} onclick={handleState} />
    </div>
  );
};

export default DeliveryAddress;

const AddAddressModal = ({ state, onclick }) => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [apartment, setApartment] = useState("");
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleAddDeliveryAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/users/delivery-address`,
        {
          streetAddress,
          apartment_suite: apartment,
          country: "United States",
          state: selectedState,
          city: "Abbeville",
          zipCode,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const currentUser = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
      console.log("add delivery address res >>>>", res?.data);
      // if (currentUser) {
      //   currentUser.deliveryAddresses = updatedAddresses;

      //   Cookies.set("user", JSON.stringify(currentUser));

      //   console.log("User data updated successfully in cookies!");
      // } else {
      //   console.error("User data not found in cookies.");
      // }
      if (res?.status === 201) {
        onclick();
      }
    } catch (error) {
      console.log("add delivery address err >>>>", error);
      toast.error(error?.response?.data?.message);
      onclick();
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedCity("");
  };

  const selectedStateData = STATES.find(
    (state) => state.name === selectedState
  );
  const cities = selectedStateData ? selectedStateData.cities : [];

  return (
    state && (
      <div className="w-full h-screen bg-[rgba(0,0,0,0.5)] fixed inset-0 z-50 flex items-center justify-center px-4">
        <form
          onSubmit={handleAddDeliveryAddress}
          className="bg-white rounded-[15px] p-8 relative w-[680px] h-auto flex flex-col items-center gap-3"
        >
          <div className="w-full flex items-center justify-between">
            <h3 className="text-[28px] blue-text font-bold">
              Delivery Address
            </h3>
            <button
              type="button"
              onClick={onclick}
              className="w-6 h-6 bg-[#F7F7F7] rounded-full p-1"
            >
              <IoClose className="w-full h-full" />
            </button>
          </div>

          <div className="w-full flex flex-col items-start gap-1">
            <label htmlFor="streetAddress" className="text-[13px] font-medium">
              Street Address
            </label>
            <input
              type="text"
              placeholder="Street address"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              className="bg-white rounded-[16px] px-4 py-3 text-sm w-full outline-none border"
            />
          </div>

          <div className="w-full flex flex-col items-start gap-1">
            <label htmlFor="appartment" className="text-[13px] font-medium">
              Apartment / Suite
            </label>
            <input
              type="text"
              placeholder="Apartment/ Suite"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
              className="bg-white rounded-[16px] px-4 py-3 text-sm w-full outline-none border"
            />
          </div>

          <div className="w-full flex flex-col items-start gap-1">
            <label htmlFor="country" className="text-[13px] font-medium">
              Countrty
            </label>
            <input
              type="text"
              placeholder="Country"
              value={"United States"}
              disabled
              className="bg-white rounded-[16px] px-4 py-3 text-sm w-full outline-none border"
            />
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="flex flex-col items-start gap-1 w-full">
              <label htmlFor="state" className="text-sm font-medium">
                State
              </label>
              <select
                name="state"
                id="state"
                className="w-full px-4 py-3 rounded-full border outline-none text-sm bg-white"
                value={selectedState}
                onChange={handleStateChange}
              >
                <option value="">Select a State</option>
                {STATES.map((state, index) => (
                  <option key={index} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col items-start gap-1 w-full">
              <label htmlFor="city" className="text-sm font-medium">
                City
              </label>
              <select
                name="city"
                id="city"
                className="w-full px-4 py-3 rounded-full border outline-none text-sm bg-white"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedState}
              >
                <option value="">Select a City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-full flex flex-col items-start gap-1">
            <label htmlFor="zipcode" className="text-[13px] font-medium">
              Zip Code
            </label>
            <input
              type="text"
              placeholder="Zip Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="bg-white rounded-[16px] px-4 py-3 text-sm w-full outline-none border"
            />
          </div>

          <button
            type="submit"
            // onClick={onclick}
            className="text-base rounded-[16px] w-full py-3 blue-bg text-white font-bold"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>
      </div>
    )
  );
};
