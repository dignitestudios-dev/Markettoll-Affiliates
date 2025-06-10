import React, { useState } from "react";

const Pagination = ({ setPaginationNum, paginationNum }) => {
  const totalPages = 10;

  const handlePageClick = (pageNumber) => {
    setPaginationNum(pageNumber);
  };

  const handlePrevious = () => {
    if (paginationNum > 1) {
      setPaginationNum(paginationNum - 1);
    }
  };

  const handleNext = () => {
    if (paginationNum < totalPages) {
      setPaginationNum(paginationNum + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li key={i}>
          {paginationNum === i ? (
            <span className="block text-[18px]  w-8 h-8 text-center text-white bg-[#38adebe7] border-[#38adebe7] rounded leading-8 cursor-pointer">
              {i}
            </span>
          ) : (
            <button
              onClick={() => handlePageClick(i)}
              className="block text-[16px] w-8 h-8 text-center border border-gray-100 rounded leading-8 hover:bg-gray-50 transition-colors"
            >
              {i}
            </button>
          )}
        </li>
      );
    }
    return pages;
  };

  return (
    <div className="p-8">
      <ol className="flex justify-end text-xs font-medium space-x-1">
        {/* Previous Button */}
        <li>
          <button
            onClick={handlePrevious}
            disabled={paginationNum === 1}
            className={`inline-flex items-center justify-center w-8 h-8 border rounded transition-colors ${
              paginationNum === 1
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-100 hover:bg-gray-50"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>

        {/* Page Numbers */}
        {renderPageNumbers()}

        {/* Next Button */}
        <li>
          <button
            onClick={handleNext}
            disabled={paginationNum === totalPages}
            className={`inline-flex items-center justify-center w-8 h-8 border rounded transition-colors ${
              paginationNum === totalPages
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-100 hover:bg-gray-50"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
      </ol>
    </div>
  );
};

export default Pagination;
