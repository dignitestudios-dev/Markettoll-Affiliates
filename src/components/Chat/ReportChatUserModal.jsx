import React, { useContext, useState } from "react";
import { IoClose } from "react-icons/io5";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import ButtonLoader from "../Global/ButtonLoader";
import { toast } from "react-toastify";
import SuccessModal from "./SuccessModal";

const reportReasons = [
  "Item Not Received",
  "Item Not as Described",
  "Fake Product",
  "Poor Customer Services",
  "Fraudulent Activity",
  "Spam or Sacs",
  "Other",
];

const ReportChatUserModal = ({ state, onclose, sellerId }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const { user } = useContext(AuthContext);
  const [reasonError, setReasonError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sellerIdError, setSellerIdError] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) {
      setReasonError(true);
      return;
    }
    if (!sellerId) {
      setSellerIdError(!sellerIdError);
      return;
    }
    setLoading(true);
    const finalReason =
      selectedReason === "Other" ? otherReason : selectedReason;
    console.log("Submitted Reason:", finalReason);
    try {
      const res = await axios.post(
        `${BASE_URL}/users/report/${sellerId}`,
        {
          type: "chat",
          selectedReason: selectedReason,
          otherReason: otherReason,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log("report user res >>>", res);
      if (res?.status == 201) {
        setSuccessModal(true);
        // onclose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setSuccessModal(false);
    onclose();
  };

  return (
    state && (
      <div className="w-full h-screen fixed inset-0 z-50 flex items-center justify-center padding-x py-6 bg-[rgba(0,0,0,0.4)]">
        <div className="bg-white p-6 rounded-xl w-full md:w-[430px] lg:w-[611px] min-h-[133px] relative">
          <button
            type="button"
            onClick={onclose}
            className="w-6 h-6 rounded-full p-1 bg-gray-100 absolute right-5 top-5"
          >
            <IoClose className="w-full h-full" />
          </button>
          <p className="text-[18px] text-[#003DAC] font-bold">Report Seller</p>
          <p className="text-[#5C5C5C] text-[15px] mt-2">
            Please select the reason for reporting this seller from the list
            below:
          </p>
          {reasonError && (
            <p className="text-sm text-red-500 mt-3">
              Please choose a reason to report
            </p>
          )}
          {sellerIdError && (
            <p className="text-sm text-red-500 mt-3">
              Something went wrong. Try again!
            </p>
          )}

          <div className="w-full mt-4">
            <ul className="w-full">
              {reportReasons.map((reason, index) => (
                <li
                  key={index}
                  className="flex items-center justify-start gap-2 my-1"
                >
                  <input
                    type="radio"
                    id={reason}
                    name="reportReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                  />
                  <label htmlFor={reason}>{reason}</label>
                </li>
              ))}
            </ul>

            {selectedReason === "Other" && (
              <textarea
                className="w-full mt-3 p-4 border rounded-[20px] text-sm h-[122px] outline-none bg-[#EFEFEF]"
                placeholder="Please specify the reason"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
              />
            )}
          </div>

          <div className="w-full flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="text-[14px] font-semibold text-[#ffffff] w-full bg-[#0098EA] py-3 rounded-2xl"
            >
              {loading ? <ButtonLoader /> : "Submit"}
            </button>
          </div>
        </div>
        <SuccessModal
          onclose={closeSuccessModal}
          open={successModal}
          text={"You have successfully reported the seller."}
        />
      </div>
    )
  );
};

export default ReportChatUserModal;
