import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaBriefcase,
  FaBuilding,
  FaClock,
  FaDollarSign,
  FaArrowLeft,
  FaCalendar,
  FaUsers,
} from "react-icons/fa";
import { BASE_URL } from "../../api/api";
import Loader from "../Global/Loader";
import { toast } from "react-toastify";

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [isLiking, setIsLiking] = useState(false);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${BASE_URL}/users/get-jobs/${jobId}`);

      console.log("Job details response:", res);
      setJob(res?.data?.job || res?.data);
    } catch (err) {
      console.error("Error fetching job details:", err);
      setError("Failed to load job details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchJobDetails}
            className="text-white px-6 py-2 rounded-lg"
            style={{ backgroundColor: "#0098EA" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Job not found</p>
      </div>
    );
  }

  // const handleLikeClick = async () => {
  //   if (isLiking) return;
  //   setIsLiking(true);
  //   try {
  //     await onLike(job.id);
  //   } catch (error) {
  //     console.log("Error liking job:", error);
  //   } finally {
  //     setIsLiking(false);
  //   }
  // };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };
  const handleApplyNow = () => {
    if (!job?.applicationType || !job?.applicationTypeValue) {
      toast.error("No application contact available for this job.");
      return;
    }

    const type = job.applicationType.toLowerCase();
    const value = job.applicationTypeValue.trim();

    if (type === "application link") {
      window.open(value, "_blank"); // Open link in new tab
    } else if (type === "email") {
      window.location.href = `mailto:${value}`;
    } else if (type === "phone") {
      window.location.href = `tel:${value}`;
    } else {
      alert("Invalid application type.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <FaArrowLeft className="text-sm" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Job Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {job.jobTitle}
                </h1>
              </div>
              {/* Like Button - Commented */}
              {/* <button
                onClick={handleLikeClick}
                disabled={isLiking}
                className="p-3 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                {job.isLiked ? (
                  <FaHeart className="text-red-500 text-xl" />
                ) : (
                  <FaRegHeart className="text-gray-400 text-xl hover:text-red-500" />
                )}
              </button> */}
            </div>

            {/* Job Meta Information */}
            <div className="flex flex-wrap gap-4 mb-6">
              {job.jobCategory && (
                <div className="flex items-center gap-2">
                  <span className="inline-block bg-blue-50 text-gray-700 text-sm px-3 py-1 rounded-full border border-gray-200">
                    {job.jobCategory}
                  </span>
                </div>
              )}
              {job.employmentType && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaBriefcase className="text-xs" />
                  <span>{job.employmentType}</span>
                </div>
              )}
              {job.workplace && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaBuilding className="text-xs" />
                  <span>{job.workplace}</span>
                </div>
              )}
              {job.shiftType && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaClock className="text-xs" />
                  <span>{job.shiftType}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              {(job.city || job.state || job.zipCode) && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FaMapMarkerAlt className="text-sm" />
                  <span className="text-sm">
                    {[job.city, job.state, job.zipCode]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}
              {job.createdAt && (
                <div className="flex items-center gap-2 text-gray-600">
                  <FaCalendar className="text-sm" />
                  <span className="text-sm">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Salary */}
            {job.pay && (
              <div className="flex items-center gap-2 mb-6">
                <span
                  className="text-xl font-semibold"
                  style={{ color: "#0098EA" }}
                >
                  {job.pay}
                </span>
              </div>
            )}

            {/* Apply Button */}
            <button
              onClick={handleApplyNow}
              className="text-white text-base font-medium py-3 px-8 rounded-lg transition-all duration-200 hover:shadow-lg"
              style={{ backgroundColor: "#0098EA" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#0087D1")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#0098EA")}
            >
              Apply Now
            </button>
          </div>

          {/* Job Details Sections */}
          <div className="p-8">
            {/* Job Description */}
            {job.description && (
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Job Description
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </section>
            )}

            {/* Bottom Apply Button */}
            {/* <div className="flex justify-center pt-4">
              <button
                className="text-white text-base font-medium py-3 px-12 rounded-lg transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: "#0098EA" }}
              >
                Apply for this Position
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
