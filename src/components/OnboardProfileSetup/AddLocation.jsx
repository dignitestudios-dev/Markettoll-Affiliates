import React from "react";
import { STATES } from "../../constants/states";

const AddLocation = ({
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
}) => {
  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedCity(""); // Reset city when state changes
  };

  // Get cities for the selected state
  const selectedStateData = STATES.find(
    (state) => state.name === selectedState
  );
  const cities = selectedStateData ? selectedStateData.cities : [];

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
          {/* <select
            name="city"
            id="city"
            className="w-full px-4 py-3 rounded-full border outline-none text-sm bg-white"
          ></select> */}
        </div>
      </div>
    </div>
  );
};

export default AddLocation;
