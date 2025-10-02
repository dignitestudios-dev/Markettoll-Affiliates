import React, { useContext, useEffect, useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import ButtonLoader from "../../components/Global/ButtonLoader";

const JobReviewPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const jobData = location?.state?.jobData;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!jobData) {
      navigate("/add-job");
    }
  }, [jobData, navigate]);

  const uploadJob = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/users/create-job`, jobData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("jobId", JSON.stringify(response.data.data));
        // navigate("/boost-job", {
        //   state: {
        //     from: window.location.href,
        //     type: "job",
        //     id: response?.data?.data?._id,
        //   },
        // });
        navigate("/")
        return response.data;
      }
    } catch (error) {
      console.error("Error uploading job:", error);
      toast.error(error?.response?.data?.message || "Failed to post job");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateBack = () => {
    navigate("/add-job", {
      state: { jobData: location?.state?.jobData },
    });
  };

  // Helper to handle optional fields
  const displayValue = (val) => (val && val.trim() !== "" ? val : "----");

  return (
    <div className="padding-x py-6 w-full">
      <div className="w-full px-4 md:px-8 lg:px-12 py-5 rounded-[30px] bg-[#F7F7F7]">
        {/* Back Button */}
        <button
          type="button"
          onClick={handleNavigateBack}
          className="mb-5 flex items-center justify-start gap-1.5"
        >
          <GoArrowLeft className="text-[#0098EA]" />
          <span className="text-sm text-gray-500 font-medium">Back</span>
        </button>

        <div className="w-full bg-white px-4 md:px-8 lg:px-12 py-12 rounded-[30px]">
          {/* Job Info */}
          <div className="w-full flex flex-col items-start gap-6">
            {/* Title + Category */}
            <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <h2 className="text-[20px] blue-text font-bold">
                {jobData?.jobTitle}
              </h2>
              <h3 className="text-[16px] font-medium text-gray-500">
                {jobData?.jobCategory}
              </h3>
            </div>

            {/* Details Grid */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {/* Employment Type */}
              <div className="flex items-center gap-4">
                <p className="text-[13px] text-[#7C7C7C] font-medium">
                  Employment Type
                </p>
                <p className="text-[13px] font-medium">
                  {displayValue(jobData?.employmentType)}
                </p>
              </div>

              {/* Workplace */}
              <div className="flex items-center gap-4">
                <p className="text-[13px] text-[#7C7C7C] font-medium">
                  Workplace
                </p>
                <p className="text-[13px] font-medium">
                  {displayValue(jobData?.workplace)}
                </p>
              </div>

              {/* Shift Type */}
              <div className="flex items-center gap-4">
                <p className="text-[13px] text-[#7C7C7C] font-medium">
                  Shift Type
                </p>
                <p className="text-[13px] font-medium">
                  {displayValue(jobData?.shiftType)}
                </p>
              </div>

              {/* Pay */}
              <div className="flex items-center gap-4">
                <p className="text-[13px] text-[#7C7C7C] font-medium">Pay</p>
                <p className="text-[13px] font-medium">
                  {displayValue(jobData?.pay)}
                </p>
              </div>

              {/* State */}
              <div className="flex items-center gap-4">
                <p className="text-[13px] text-[#7C7C7C] font-medium">State</p>
                <p className="text-[13px] font-medium">
                  {displayValue(jobData?.state)}
                </p>
              </div>

              {/* City */}
              <div className="flex items-center gap-4">
                <p className="text-[13px] text-[#7C7C7C] font-medium">City</p>
                <p className="text-[13px] font-medium">
                  {displayValue(jobData?.city)}
                </p>
              </div>

              {/* Zip Code */}
              <div className="flex items-center gap-4">
                <p className="text-[13px] text-[#7C7C7C] font-medium">
                  Zip Code
                </p>
                <p className="text-[13px] font-medium">
                  {displayValue(jobData?.zipCode)}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="w-full">
              <p className="text-[16px] text-[#003DAC] font-bold mb-3">
                Description
              </p>
              <p className="text-[14px] font-normal whitespace-pre-line">
                {jobData?.description}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <button
              type="button"
              onClick={handleNavigateBack}
              className="bg-white border light-blue-text py-3 text-center rounded-full w-full text-sm font-bold"
            >
              Back
            </button>
            <button
              type="button"
              onClick={uploadJob}
              className="blue-bg text-white py-3 text-center rounded-full w-full text-sm font-bold h-[50px]"
            >
              {loading ? <ButtonLoader /> : "Post Job"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobReviewPage;
