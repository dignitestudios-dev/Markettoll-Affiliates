import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import { CitySelect, StateSelect } from "react-country-state-city";

const SettingsAddAddressPage = () => {
  const [streetAddress, setStreetAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [stateid, setstateid] = useState(0);
  const navigate = useNavigate();
  const { user, fetchUserProfile } = useContext(AuthContext);
  const [addressAdded, setAddressAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [stateFullName, setStateFullName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!streetAddress || !stateFullName || !selectedCity || !zipCode) {
      toast.error("Please fill the required fields");
      return;
    }
    if (zipCode.length > 5 || zipCode.length < 5) {
      toast.error("Zip Code must be 5 digits.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/users/delivery-address`,
        {
          streetAddress,
          apartment_suite: apartment,
          country: "United States",
          state: stateFullName,
          city: selectedCity,
          zipCode,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      // console.log("address added >>>", res);
      if (res?.status == 201) {
        setAddressAdded(!addressAdded);
        fetchUserProfile();
        // navigate("/settings/addresses");
      }
    } catch (error) {
      // console.log("add delivery address err >>>", error?.response?.data);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModalAndNaivigate = () => {
    setAddressAdded(!addressAdded);
    navigate("/settings/addresses");
  };

  return (
    <div className="w-full px-5">
      <Link to="/settings/addresses" className="flex items-center gap-2">
        <GoArrowLeft className="text-2xl" />
        <span className="font-bold text-[28px] blue-text">Add Addresses</span>
      </Link>
      <div className="w-full border mt-5 mb-4" />
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-start gap-5"
      >
        <div className="w-full flex flex-col items-start gap-1">
          <label htmlFor="streetAddress" className="text-[13px] font-medium">
            Street address
          </label>
          <input
            type="text"
            placeholder="Street address"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            className="border rounded-2xl px-4 py-3.5 outline-none w-full text-sm"
          />
        </div>
        <div className="w-full flex flex-col items-start gap-1">
          <label htmlFor="apartment" className="text-[13px] font-medium">
            Apartment/ Suite
          </label>
          <input
            type="text"
            placeholder="Apartment/ Suite"
            value={apartment}
            onChange={(e) => setApartment(e.target.value)}
            className="border rounded-2xl px-4 py-3.5 outline-none w-full text-sm"
          />
        </div>
        <div className="w-full flex flex-col items-start gap-1">
          <label htmlFor="country" className="text-[13px] font-medium">
            Country
          </label>
          <input
            type="text"
            placeholder="Country"
            disabled
            value={"United States"}
            className="border bg-white rounded-2xl px-4 py-3.5 outline-none w-full text-sm"
          />
        </div>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="flex flex-col items-start gap-1 w-full location">
            <label htmlFor="state" className="text-sm font-medium">
              State
            </label>
            <StateSelect
              countryid={233}
              onChange={(e) => {
                setstateid(e.id);
                setStateFullName(e.name);
                setSelectedState(e.name);
              }}
              placeHolder="Select State"
              className="w-full"
              style={{ border: "none" }}
            />
          </div>
          <div className="flex flex-col items-start gap-1 w-full location">
            <label htmlFor="city" className="text-sm font-medium">
              City
            </label>
            <CitySelect
              countryid={233}
              stateid={stateid}
              onChange={(e) => {
                setSelectedCity(e.name);
              }}
              placeHolder="Select City"
              style={{ border: "none" }}
            />
          </div>
        </div>
        <div className="w-full flex flex-col items-start gap-1">
          <label htmlFor="zipCode" className="text-[13px] font-medium">
            Zip code
          </label>
          <input
            type="text"
            placeholder="Zip Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="border rounded-2xl px-4 py-3.5 outline-none w-full text-sm"
          />
        </div>
        <button
          type="submit"
          className="text-base font-bold py-3 w-full text-white blue-bg rounded-2xl"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>
      <AddressModal
        addressAdded={addressAdded}
        onclose={handleCloseModalAndNaivigate}
      />
    </div>
  );
};

export default SettingsAddAddressPage;

const AddressModal = ({ addressAdded, onclose }) => {
  return (
    addressAdded && (
      <div className="w-full h-screen fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
        <div className="bg-white w-full lg:w-[440px] h-[209px] p-7 relative rounded-[20px] flex flex-col items-center justify-center gap-2">
          <button
            type="button"
            onClick={onclose}
            className="w-6 h-6 rounded-full p-1 bg-gray-100 absolute top-5 right-5"
          >
            <IoClose className="w-full h-full" />
          </button>

          <div className="rounded-full blue-bg w-[69.67px] h-[69.67px] p-3">
            <FaCheck className="text-white w-full h-full" />
          </div>
          <span className="text-lg blue-text font-bold">Address Added</span>
          <span className="text-[#5c5c5c]">Address added successfully</span>
        </div>
      </div>
    )
  );
};
