import React, { useContext, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoMdCheckmark } from "react-icons/io";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import ButtonLoader from "../Global/ButtonLoader";

const reportIssues = [
  "Item Not Received",
  "Item Not as Described",
  "Fake Product",
  "Poor Customer Services",
  "Fraudulent Activity",
  "Spam or Sacs",
  "Others",
];

const ReportSellerModal = ({
  openReportModal,
  setOpenReportModal,
  sellerId,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [otherText, setOtherText] = useState("");
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const toggleSuccessModal = () => {
    setOpenSuccessModal(!openSuccessModal);
  };

  const handleCheckboxChange = (e) => {
    const value = e.target.name;
    if (value === "Others") {
      setSelectedOption(value);
    } else {
      setSelectedOption(value);
      setOtherText("");
    }
  };

  const handleOtherTextChange = (e) => {
    setOtherText(e.target.value);
  };

  const handleReportUser = async () => {
    // console.log("selectedOption >>>", selectedOption);
    if (!selectedOption) {
      toast.error("Please choose an option");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/users/report/${sellerId}`,
        {
          type: "seller-profile",
          selectedReason: selectedOption,
          otherReason: otherText,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log("seller reported >>>", res?.data);
      if (res?.data?.success) {
        setOpenReportModal(!openReportModal);
        toggleSuccessModal();
      }
    } catch (error) {
      console.log("error while reporting user >>>", error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenReportModal(!openReportModal);
  };

  return (
    <>
      {openReportModal && (
        <div className="fixed w-full h-screen z-50 inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center padding-x">
          <div className="bg-white rounded-lg py-5 px-10 w-full lg:w-[611px] relative flex flex-col items-start gap-4">
            <div className="w-full flex items-center justify-between">
              <h2 className="text-lg font-bold blue-text">Report Seller</h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-6 h-6 rounded-full bg-gray-200 p-1"
              >
                <IoClose />
              </button>
            </div>
            <p className="text-[15px] text-[#5C5C5C]">
              Please select the reason for reporting this seller from the list
              below:
            </p>

            <ul className="">
              {reportIssues?.map((r, index) => (
                <li
                  className="flex items-center justify-start gap-2"
                  key={index}
                >
                  <input
                    type="checkbox"
                    name={r}
                    id={r}
                    className="w-[16px] h-[16px] rounded-[100px] p-0.5"
                    checked={selectedOption === r}
                    onChange={handleCheckboxChange}
                  />
                  <span className="text-[16px] text-[#000] my-2">{r}</span>
                </li>
              ))}
            </ul>

            {selectedOption === "Others" && (
              <textarea
                className="w-full border-none outline-none rounded-xl bg-[#EFEFEF] text-[15px] p-4 text-[#5C5C5C] h-[122px]"
                placeholder="Write your reason here"
                value={otherText}
                onChange={handleOtherTextChange}
              />
            )}

            <button
              type="button"
              onClick={() => handleReportUser()}
              className="blue-bg text-white py-3 rounded-2xl w-full font-bold text-sm h-[50px]"
            >
              {loading ? <ButtonLoader /> : "Submit"}
            </button>
          </div>
        </div>
      )}
      <SuccessModal
        openSuccessModal={openSuccessModal}
        onclick={toggleSuccessModal}
      />
    </>
  );
};

export default ReportSellerModal;

export const SuccessModal = ({ openSuccessModal, onclick }) => {
  return (
    openSuccessModal && (
      <div className="fixed w-full h-screen z-50 inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center padding-x">
        <div className="bg-white rounded-lg py-5 px-10 w-full lg:w-[440px] h-[183px] relative flex flex-col items-center justify-center gap-4">
          <button
            type="button"
            onClick={onclick}
            className="w-6 h-6 rounded-full bg-gray-200 p-1 absolute top-5 right-5"
          >
            <IoClose />
          </button>
          <img
            src="/check-image.png"
            alt="check-image"
            className="w-[69px] h-[69px]"
          />
          <p className="text-[15px] text-[#5C5C5C]">
            You have successfully reported the seller.
          </p>
        </div>
      </div>
    )
  );
};
