import React, { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";

const AddLocation = ({
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  stateFullName,
  setStateFullName,
}) => {
  const [fullStateName, setFullStateName] = useState(""); // New state for full state name
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // console.log("selectedState >>>", selectedState);
  // console.log("selectedCity >>>", selectedCity);
  // console.log("fullStateName >>>", fullStateName);

  // Fetch countries and states on component mount
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    const usStates = State.getStatesOfCountry("US");
    setStates(usStates);
  }, []);

  // Fetch cities when selected state changes
  useEffect(() => {
    if (selectedState) {
      const allCities = City.getCitiesOfState("US", selectedState);
      setCities(allCities);
    } else {
      setCities([]); // Clear cities if no state is selected
    }
  }, [selectedState]);

  // Function to get the full state name by its abbreviation (isoCode)
  const getStateFullName = (abbreviation) => {
    const state = states.find((state) => state.isoCode === abbreviation);
    return state ? state.name : abbreviation;
  };

  // Update fullStateName whenever selectedState changes
  useEffect(() => {
    if (selectedState) {
      const fullState = getStateFullName(selectedState);
      setFullStateName(fullState); // Set the full state name in the state
      setStateFullName(fullState);
    } else {
      setFullStateName(""); // Clear full state name if no state is selected
    }
  }, [selectedState]);

  // Handle state change and update selected state
  const handleStateChange = (event) => {
    setSelectedState(event.target.value); // Set selected state abbreviation
    setSelectedCity(""); // Clear selected city when state changes
  };

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <div className="flex flex-col items-start gap-1 w-full lg:w-[630px]">
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
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AddLocation;
