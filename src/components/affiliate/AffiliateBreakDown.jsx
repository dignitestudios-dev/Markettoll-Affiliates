import React from "react";
import { GoArrowLeft } from "react-icons/go";

export default function AffiliateBreakDown({ refrals, setActiveView }) {
  console.log(refrals,"affiliateReferals")
  return (
    <div className="bg-[#F7F7F7] mt-10 rounded-[20px] p-4">
      <button
        onClick={() => setActiveView("main")}
        className="flex items-center gap-1 mb-4"
      >
        <GoArrowLeft className="text-xl text-[#0098EA]" />
        <span className="text-sm font-medium text-[#5C5C5C]">Back</span>
      </button>

      <h3 className="text-[20px] font-bold text-[#000000] mb-4">
        Affiliate Breakdown
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-[#33333324] text-[#7C7C7C] text-[14px] font-[400]">
              <th className="px-6 py-3 text-start">User Name</th>
              <th className="px-6 py-3 text-start">User Email</th>
              <th className="px-6 py-3 text-start">User Phone</th>
              <th className="px-6 py-3 text-end">Created At</th>
              {/* <th className="px-6 py-3 text-end">Commission %</th>
              <th className="px-6 py-3 text-end">Commission Earned</th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#33333324]">
            {refrals?.length > 0 ? (
              refrals.map((item, i) => (
                <tr key={i} className="text-[#181818] text-[14px] font-[400]">
                  <td className="px-6 py-4">{item?.name}</td>
                  <td className="px-6 py-4">{item?.email?.value}</td>
                  <td className="px-6 py-4">{item?.phoneNumber?.value}</td>
                  <td className="px-6 py-4 text-end">{ new Date(item?.createdAt)?.toLocaleDateString() }</td>
                  {/* <td className="px-6 py-4 text-end">{item?.referralPercentage}</td>
                  <td className="px-6 py-4 text-end">{item?.referralAmount}</td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
