import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { ProductDataReview } from "../../context/addProduct";
import { toast } from "react-toastify";
import { CitySelect, StateSelect } from "react-country-state-city";

const AddJobForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setServiceData } = useContext(ProductDataReview);

  const [stateid, setstateid] = useState(0);
  const [jobTitle, setJobTitle] = useState(
    location?.state?.jobData?.jobTitle || ""
  );
  const [description, setDescription] = useState(
    location?.state?.jobData?.description || ""
  );
  const [selectedState, setSelectedState] = useState(
    location?.state?.jobData?.selectedState || ""
  );
  const [fullStateName, setFullStateName] = useState(
    location?.state?.jobData?.selectedState || ""
  );
  const [selectedCity, setSelectedCity] = useState(
    location?.state?.jobData?.selectedCity || ""
  );
  const [zipCode, setZipCode] = useState(
    location?.state?.jobData?.zipCode || ""
  );
  const [workplace, setWorkplace] = useState(
    location?.state?.jobData?.workplace || ""
  );
  const [jobCategory, setJobCategory] = useState(
    location?.state?.jobData?.jobCategory || ""
  );
  const [employmentType, setEmploymentType] = useState(
    location?.state?.jobData?.employmentType || ""
  );
  const [shiftType, setShiftType] = useState(
    location?.state?.jobData?.shiftType || ""
  );
  const [pay, setPay] = useState(location?.state?.jobData?.pay || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!jobTitle) {
      toast.error("Please enter job title");
      return;
    } else if (jobTitle.length < 4) {
      toast.error("Job title must be at least 4 characters long.");
      return;
    }

    if (!description) {
      toast.error("Please add job description");
      return;
    } else if (description.length < 100) {
      toast.error("Description must be at least 100 characters.");
      return;
    } else if (description.length > 1500) {
      toast.error("Description must be at most 1500 characters.");
      return;
    }

    if (!selectedState) {
      toast.error("Please select a state");
      return;
    }
    if (!selectedCity) {
      toast.error("Please select a city");
      return;
    }
    if (!zipCode) {
      toast.error("Please enter zip code");
      return;
    } else if (zipCode.length < 5) {
      toast.error("Zip code must be 5 digits.");
      return;
    }

    if (!jobCategory) {
      toast.error("Please enter job category");
      return;
    }

    if (!employmentType) {
      toast.error("Please select employment type");
      return;
    }

    // Save job data in context
    const jobData = {
      jobTitle,
      description,
      state: fullStateName,
      city: selectedCity,
      zipCode,
      workplace: workplace || null, // Optional field
      jobCategory,
      employmentType,
      shiftType: shiftType || null, // Optional field
      pay: pay || null, // Optional field
    };

    setServiceData(jobData);

    navigate("/job-review", {
      state: { jobData },
    });
  };

  return (
    <div className="padding-x w-full py-6">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-[#F7F7F7] rounded-[30px] px-4 lg:px-8 py-12"
      >
        <div className="w-full flex items-center gap-6">
          <Link to="/jobs" className="flex items-center gap-1">
            <GoArrowLeft className="light-blue-text text-xl" />
            <span className="text-sm font-medium text-[#5C5C5C]">Back</span>
          </Link>
          <h2 className="blue-text font-bold text-[24px]">Add Job Details</h2>
        </div>

        <div className="w-full padding-x mt-6 flex flex-col gap-6">
          {/* Job Title */}
          <div className="w-full">
            <label htmlFor="jobTitle" className="text-sm font-semibold">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Software Engineer"
              className="w-full py-4 px-5 border border-[#d9d9d9] outline-none text-sm rounded-[20px] bg-white text-[#5C5C5C]"
            />
          </div>

          {/* Job Description */}
          <div className="w-full">
            <label htmlFor="description" className="text-sm font-semibold">
              Job Description <span className="text-red-500">*</span>{" "}
              <span className="text-gray-400">({description.length})</span>
            </label>
            <textarea
              id="description"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full py-4 border border-[#d9d9d9] px-5 outline-none text-sm rounded-[20px] bg-white text-[#5C5C5C]"
              placeholder="Describe the job responsibilities, requirements, and benefits..."
            ></textarea>
          </div>

          {/* State & City */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="state" className="text-sm font-medium">
                State <span className="text-red-500">*</span>
              </label>
              <StateSelect
                countryid={233}
                onChange={(e) => {
                  setstateid(e.id);
                  setFullStateName(e.name);
                  setSelectedState(e.name);
                }}
                placeHolder="Select State"
                style={{ border: "none" }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="city" className="text-sm font-medium">
                City <span className="text-red-500">*</span>
              </label>
              <CitySelect
                countryid={233}
                stateid={stateid}
                disabled={!stateid}
                onChange={(e) => setSelectedCity(e.name)}
                placeHolder="Select City"
                style={{ border: "none" }}
              />
            </div>
          </div>

          {/* Zip Code */}
          <div className="w-full">
            <label htmlFor="zipCode" className="text-sm font-semibold">
              Zip Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="zipCode"
              placeholder="12345"
              value={zipCode}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                if (value.length <= 5) setZipCode(value);
              }}
              className="w-full py-4 px-5 border border-[#d9d9d9] outline-none text-sm rounded-[20px] bg-white text-[#5C5C5C]"
            />
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Employment Type */}
            <div className="w-full">
              <label htmlFor="employmentType" className="text-sm font-semibold">
                Employment Type <span className="text-red-500">*</span>
              </label>
              <select
                id="employmentType"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full py-4 px-5 border border-[#d9d9d9] text-sm rounded-[20px] bg-white text-[#5C5C5C]"
              >
                <option value="">Select Employment Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Workplace (Optional) */}
            <div className="w-full">
              <label htmlFor="workplace" className="text-sm font-semibold">
                Workplace <span className="text-gray-500">(Optional)</span>
              </label>
              <select
                id="workplace"
                value={workplace}
                onChange={(e) => setWorkplace(e.target.value)}
                className="w-full py-4 px-5 border border-[#d9d9d9] text-sm rounded-[20px] bg-white text-[#5C5C5C]"
              >
                <option value="">Select Workplace</option>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Shift Type (Optional) */}
            <div className="w-full">
              <label htmlFor="shiftType" className="text-sm font-semibold">
                Shift Type <span className="text-gray-500">(Optional)</span>
              </label>
              <select
                id="shiftType"
                value={shiftType}
                onChange={(e) => setShiftType(e.target.value)}
                className="w-full py-4 px-5 border border-[#d9d9d9] text-sm rounded-[20px] bg-white text-[#5C5C5C]"
              >
                <option value="">Select Shift Type</option>
                <option value="Day Shift">Day Shift</option>
                <option value="Night Shift">Night Shift</option>
                <option value="Swing Shift">Swing Shift</option>
                <option value="Flexible Shift">Flexible Shift</option>
              </select>
            </div>

            {/* Pay (Optional) */}
            <div className="w-full">
              <label htmlFor="pay" className="text-sm font-semibold">
                Pay Range <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="text"
                id="pay"
                placeholder="e.g., $50,000-$70,000 or $25/hour"
                value={pay}
                onChange={(e) => setPay(e.target.value)}
                className="w-full py-4 px-5 border border-[#d9d9d9] outline-none text-sm rounded-[20px] bg-white text-[#5C5C5C]"
              />
            </div>
          </div>

          {/* Job Category */}
          <div className="w-full">
            <label htmlFor="jobCategory" className="text-sm font-semibold">
              Job Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="jobCategory"
              placeholder="Engineering, Marketing, Healthcare, etc."
              value={jobCategory}
              onChange={(e) => setJobCategory(e.target.value)}
              className="w-full py-4 px-5 border border-[#d9d9d9] outline-none text-sm rounded-[20px] bg-white text-[#5C5C5C]"
            />
          </div>

          {/* Buttons */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
            <Link
              to="/jobs"
              className="bg-white light-blue-text font-semibold text-sm py-3 rounded-[20px] text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="blue-bg text-white font-semibold text-sm py-3 rounded-[20px]"
            >
              Review
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddJobForm;
