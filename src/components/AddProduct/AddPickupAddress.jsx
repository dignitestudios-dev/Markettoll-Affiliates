import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext";
import { CitySelect, StateSelect } from "react-country-state-city";

const AddPickupAddress = () => {
  const location = useLocation();
  const [streetAddress, setStreetAddress] = useState("");
  const [apartmentSuite, setApartmentSuite] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate();
  const [addressAdded, setAddressAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stateid, setstateid] = useState(0);

  const { user, fetchUserProfile, userProfile } = useContext(AuthContext);

  const [stateFullName, setStateFullName] = useState("");
  const [fullStateName, setFullStateName] = useState("");
  const [states, setStates] = useState([]);
  const [stateCities, setStateCities] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!streetAddress) {
      toast.error("Add street address");
      return;
    }
    if (!selectedState) {
      toast.error("Please choose a state");
      return;
    }
    if (!selectedCity) {
      toast.error("Please choose a city");
      return;
    }
    if (location?.state?.type == "pickupAddress") {
      try {
        const res = await axios.put(
          `${BASE_URL}/users/pickup-address`,
          {
            streetAddress,
            apartment_suite: apartmentSuite,
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
        // console.log("pickup address added >>>", res);
        if (res?.status == 200) {
          setAddressAdded(!addressAdded);
          fetchUserProfile();
        }
      } catch (error) {
        // console.log(
        //   "error while adding pickup address >>>",
        //   error?.response?.data
        // );
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    } else if (location?.state?.type == "deliveryAddress") {
      try {
        const res = await axios.put(
          `${BASE_URL}/users/delivery-address/${userProfile?.address?._id}`,
          {
            streetAddress,
            apartment_suite: apartmentSuite,
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
        // console.log("pickup address added >>>", res);
        if (res?.status == 200) {
          setAddressAdded(!addressAdded);
          fetchUserProfile();
        }
      } catch (error) {
        // console.log(
        //   "error while adding pickup address >>>",
        //   error?.response?.data
        // );
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseModalAndNaivigate = () => {
    setAddressAdded(!addressAdded);
    navigate("/settings/addresses");
  };

  return (
    <div className="w-full">
      {/* <Link to="/settings/addresses" className="flex items-center gap-2">
        <GoArrowLeft className="text-2xl" />
        <span className="font-bold text-[28px] blue-text">Edit Addresses</span>
      </Link>
      <div className="w-full border mt-5 mb-4" /> */}
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
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            placeholder="Street address"
            className="border rounded-2xl px-4 py-3 outline-none w-full text-sm"
          />
        </div>
        <div className="w-full flex flex-col items-start gap-1">
          <label htmlFor="apartment" className="text-[13px] font-medium">
            Apartment/ Suite
          </label>
          <input
            type="text"
            placeholder="Apartment/ Suite"
            value={apartmentSuite}
            onChange={(e) => setApartmentSuite(e.target.value)}
            className="border rounded-2xl px-4 py-3 outline-none w-full text-sm"
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
            value={"United State"}
            className="border bg-white rounded-2xl px-4 py-3 outline-none w-full text-sm"
          />
        </div>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="flex flex-col items-start gap-1 w-full location ">
            <label htmlFor="state" className="text-sm font-medium">
              State
            </label>
            <StateSelect
              countryid={233}
              onChange={(e) => {
                setstateid(e.id);
                setFullStateName(e.name);
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
              disabled={!selectedState}
              onChange={(e) => {
                console.log(e);
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
            className="border rounded-2xl px-4 py-3 outline-none w-full text-sm"
          />
        </div>
        {/* <button
          type="submit"
          className="text-base font-bold py-3 w-full text-white blue-bg rounded-2xl"
        >
          {loading ? "Saving..." : "Save"}
        </button> */}
      </form>
      <AddressModal
        addressAdded={addressAdded}
        onclose={handleCloseModalAndNaivigate}
      />
    </div>
  );
};

export default AddPickupAddress;

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
          <span className="text-lg blue-text font-bold">Address Changed</span>
          <span className="text-[#5c5c5c]">Address changed successfully</span>
        </div>
      </div>
    )
  );
};
