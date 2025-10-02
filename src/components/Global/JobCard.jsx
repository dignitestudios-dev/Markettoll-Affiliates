import React, { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaBriefcase,
  FaBuilding,
  FaClock,
  FaDollarSign,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const JobCard = ({ job, onLike }) => {
  const [isLiking, setIsLiking] = useState(false);

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

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100 relative">
      {/* Like Button */}
      {/* <button
        onClick={handleLikeClick}
        disabled={isLiking}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
      >
        {job.isLiked ? (
          <FaHeart className="text-red-500 text-lg" />
        ) : (
          <FaRegHeart className="text-gray-400 text-lg hover:text-red-500" />
        )}
      </button> */}

      {/* Job Title */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 pr-8">
        {job.jobTitle}
      </h3>

      {/* Job Category */}
      <div className="flex items-center mb-3">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          {job.jobCategory}
        </span>
      </div>

      {/* Employment Type, Workplace, and Shift Type */}
      <div className="flex items-center flex-wrap gap-2 mb-3">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <FaBriefcase className="text-xs" />
          <span>{job.employmentType}</span>
        </div>
        {job.workplace && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <FaBuilding className="text-xs" />
            <span>{job.workplace}</span>
          </div>
        )}
        {job.shiftType && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <FaClock className="text-xs" />
            <span>{job.shiftType}</span>
          </div>
        )}
      </div>

      {/* Pay */}
      {job.pay && (
        <div className="flex items-center gap-1 text-sm text-green-600 font-medium mb-3">
          <FaDollarSign className="text-xs" />
          <span>{job.pay}</span>
        </div>
      )}

      {/* Location */}
      <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
        <FaMapMarkerAlt className="text-xs" />
        <span>
          {job.city}, {job.state} {job.zipCode}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        {truncateText(job.description, 120)}
      </p>

      {/* Action Button */}
      <div className="flex justify-between items-center">
        <Link to={`/job/${job._id}`}>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200">
          View Details
        </button>
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
