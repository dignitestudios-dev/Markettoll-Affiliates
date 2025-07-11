import React from "react";
import { GoArrowLeft } from "react-icons/go";

export default function CommisionBreakDown({ refrals, setActiveView }) {
  return (
    <div className="bg-[#F7F7F7] mt-10 rounded-[20px] p-4">
      {/* <button
        onClick={() => setActiveView("main")}
        className="flex items-center gap-1 mb-4"
      >
        <GoArrowLeft className="text-xl text-[#0098EA]" />
        <span className="text-sm font-medium text-[#5C5C5C]">Back</span>
      </button> */}

      <div className="flex justify-between items-center">
        <h3 className="text-[20px] font-bold text-[#000000]">Referral Commission Breakdown</h3>
        {/* <button
          onClick={() => setActiveView("affiliate")}
          className="text-[#0098EA] underline text-[16px] font-[400]"
        >
          All Affiliates
        </button> */}
      </div>

      <div className="mt-10 overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-[#33333324] text-[#7C7C7C] text-[14px] font-[400]">
              <th className="px-6 py-3 text-start">User Name</th>
              <th className="px-6 py-3 text-start">User Email</th>
              <th className="px-6 py-3 text-start">Subscription Plan Type</th>
              <th className="px-6 py-3 text-end">Plan Price</th>
              <th className="px-6 py-3 text-end">Subscribed on</th>
              <th className="px-6 py-3 text-end">Commission %</th>
              <th className="px-6 py-3 text-end">Commission Earned</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#33333324]">
            {refrals?.length > 0 ? (
              refrals.map((item, i) => (
                <tr key={i} className="text-[#181818] text-[14px] font-[400]">
                  <td className="px-6 py-4">{item?.referredUser?.name}</td>
                  <td className="px-6 py-4">{item?.referredUser?.email?.value}</td>
                  <td className="px-6 py-4">{item?.subscriptionPlan}</td>
                  <td className="px-6 py-4 text-end">${item?.amountPaid}</td>
                  <td className="px-6 py-4 text-end">{new Date(item?.createdAt).toLocaleDateString() }</td>
                  <td className="px-6 py-4 text-end">{item?.referralPercentage}</td>
                  <td className="px-6 py-4 text-end">{item?.referralAmount}</td>
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
