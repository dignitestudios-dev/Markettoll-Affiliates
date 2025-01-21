import React, { useContext, useEffect, useState } from "react";
// import { Country, State, City } from "country-state-city";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import ButtonLoader from "../Global/ButtonLoader";
import { toast } from "react-toastify";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

const AddLocationForm = ({}) => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate();
  const { user, fetchUserProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [zipCode, setZipCode] = useState("");

  const [stateFullName, setStateFullName] = useState("");
  const [fullStateName, setFullStateName] = useState("");
  const [states, setStates] = useState([]);
  const [stateCities, setStateCities] = useState([]);

  const [countryid, setCountryid] = useState(0);
  const [stateid, setstateid] = useState(0);

  // useEffect(() => {
  //   const usStates = State.getStatesOfCountry("US");
  //   setStates(usStates);
  // }, []);

  // useEffect(() => {
  //   if (selectedState) {
  //     const allCities = City.getCitiesOfState("US", selectedState);
  //     setStateCities(allCities);
  //   } else {
  //     setStateCities([]);
  //   }
  // }, [selectedState]);

  // const getStateFullName = (abbreviation) => {
  //   const state = states.find((state) => state.isoCode === abbreviation);
  //   return state ? state.name : abbreviation;
  // };

  // useEffect(() => {
  //   if (selectedState) {
  //     const fullState = getStateFullName(selectedState);
  //     setFullStateName(fullState);
  //     setStateFullName(fullState);
  //   } else {
  //     setFullStateName("");
  //   }
  // }, [selectedState]);

  // const handleStateChange = (event) => {
  //   setSelectedState(event.target.value);
  //   setSelectedCity("");
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Something went wrong");
      return;
    }
    if (!selectedState || !selectedCity) {
      toast.error("Please select both state and city.");
      return;
    }
    setLoading(true);
    const addressData = {
      streetAddress: "",
      apartment_suite: "",
      country: "United States",
      state: stateFullName,
      city: selectedCity,
      zipCode: zipCode,
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/users/address`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.success) {
        fetchUserProfile();
        toast.success("Address added successfully");
        navigate("/add-service-or-product");
        return response.data;
      }
    } catch (error) {
      toast.error(error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full padding-x py-6">
      <div className="w-full bg-[#F7F7F7] rounded-[30px] px-4 py-12 flex flex-col items-center gap-5 relative">
        <button
          type="button"
          onClick={() => navigateBack()}
          className="text-sm text-[#5C5C5C] font-medium absolute top-5 left-10 flex items-center gap-1"
        >
          <GoArrowLeft className="text-xl light-blue-text" />
          Back
        </button>
        <h2 className="text-[36px] font-bold blue-text">Add Location</h2>
        {/* <div className="flex flex-col items-start gap-1 w-full lg:w-[630px]">
          <label htmlFor="country" className="text-sm font-medium">
            Country
          </label>
          <input
            type="text"
            disabled
            value={"United States"}
            className="w-full px-4 py-3 rounded-full border outline-none text-sm bg-white"
            placeholder="Country"
          />
        </div>

        <div className="w-full lg:w-[630px] grid grid-cols-1 lg:grid-cols-2 gap-5">
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
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
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
        <div className="w-full lg:w-[630px] flex flex-col items-start gap-1">
          <label htmlFor="zipCode" className="text-sm font-medium">
            Zip Code
          </label>
          <input
            type="text"
            placeholder="00000"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="w-full px-4 py-3 rounded-full border outline-none text-sm bg-white"
          />
        </div>
        <div className="w-full lg:w-[635px]">
          <button
            type={"button"}
            onClick={handleSubmit}
            className="blue-bg text-white rounded-full font-bold py-3 w-full lg:w-[635px] h-[50px]"
          >
            {loading ? <ButtonLoader /> : "Add"}
          </button>
        </div> */}
      </div>
      <div>
        <h6>Country</h6>
        <CountrySelect
          onChange={(e) => {
            setCountryid(e.id);
          }}
          placeHolder="Select Country"
        />
        <h6>State</h6>
        <StateSelect
          countryid={countryid}
          onChange={(e) => {
            setstateid(e.id);
            setStateFullName(e.name);
          }}
          placeHolder="Select State"
        />
        <h6>City</h6>
        <CitySelect
          countryid={countryid}
          stateid={stateid}
          onChange={(e) => {
            console.log(e);
            setSelectedCity(e.name);
          }}
          placeHolder="Select City"
        />
      </div>
    </div>
  );
};

export default AddLocationForm;
