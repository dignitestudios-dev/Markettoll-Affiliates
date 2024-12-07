import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext";

const AddPickupAddressForm = ({
  pickupStreetAddress,
  setPickupStreetAddress,
  pickupApartment,
  setPickupApartment,
  pickupAddressState,
  setPickupAddressState,
  pickupAddressCity,
  setPickupAddresCity,
  pickupAddressZipCode,
  setPickupAddressZipCode,
}) => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  console.log("pickupAddressState >>", pickupAddressState);

  const [stateFullName, setStateFullName] = useState("");
  const [fullStateName, setFullStateName] = useState("");
  const [states, setStates] = useState([]);
  const [stateCities, setStateCities] = useState([]);

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    const usStates = State.getStatesOfCountry("US");
    setStates(usStates);
  }, []);

  useEffect(() => {
    if (selectedState) {
      const allCities = City.getCitiesOfState("US", selectedState);
      setStateCities(allCities);
    } else {
      setStateCities([]);
    }
  }, [selectedState]);

  const getStateFullName = (abbreviation) => {
    const state = states.find((state) => state.isoCode === abbreviation);
    return state ? state.name : abbreviation;
  };

  useEffect(() => {
    if (selectedState) {
      const fullState = getStateFullName(selectedState);
      setFullStateName(fullState);
      setStateFullName(fullState);
      setPickupAddressState(fullState);
    } else {
      setFullStateName("");
      setPickupAddressState("");
    }
  }, [selectedState]);

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedCity("");
    setPickupAddresCity("");
  };

  return (
    <div className="w-full">
      <div className="w-full flex flex-col items-start gap-5">
        <div className="w-full flex flex-col items-start gap-1">
          <label htmlFor="streetAddress" className="text-[13px] font-medium">
            Street address
          </label>
          <input
            type="text"
            value={pickupStreetAddress}
            onChange={(e) => setPickupStreetAddress(e.target.value)}
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
            value={pickupApartment}
            onChange={(e) => setPickupApartment(e.target.value)}
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
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
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
              value={pickupAddressCity}
              onChange={(e) => setPickupAddresCity(e.target.value)}
              disabled={!selectedState}
            >
              <option value="">Select a City</option>
              {stateCities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full flex flex-col items-start gap-1">
          <label htmlFor="zipCode" className="text-[13px] font-medium">
            Zip code
          </label>
          <input
            type="text"
            placeholder="Zip Code"
            value={pickupAddressZipCode}
            onChange={(e) => setPickupAddressZipCode(e.target.value)}
            className="border rounded-2xl px-4 py-3 outline-none w-full text-sm"
          />
        </div>
      </div>
      {/* <AddressModal
        addressAdded={addressAdded}
        onclose={handleCloseModalAndNaivigate}
      /> */}
    </div>
  );
};

export default AddPickupAddressForm;

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
