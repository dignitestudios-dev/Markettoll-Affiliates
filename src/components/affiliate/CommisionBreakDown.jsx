import React from "react";
import { GoArrowLeft } from "react-icons/go";

export default function CommisionBreakDown({ setShowAll, showAll, refrals }) {
  return (
    <div className="bg-[#F7F7F7] mt-10 rounded-[20px] p-4 ">
      {showAll && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1 mb-4"
        >
          <GoArrowLeft className="light-blue-text text-xl" />{" "}
          <span className="text-sm font-medium text-[#5C5C5C]">Back</span>
        </button>
      )}
      <div className="flex justify-between ">
        <h3 className="text-[20px] font-bold text-[#000000]">
          Referral Commission Breakdown
        </h3>
        {!showAll && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-transparent text-[#0098EA] text-[16px] font-[400]  underline"
          >
            View All
          </button>
        )}
      </div>
      <div className="flex flex-col mt-10">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-">
                <thead>
                  <tr className="border-b border-[#33333324]">
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-[#7C7C7C] text-[14px] font-[400]"
                    >
                      User Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-[#7C7C7C] text-[14px] font-[400]"
                    >
                      User Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-[#7C7C7C] text-[14px] font-[400]"
                    >
                      Subscription Plan Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-end text-xs font-medium text-[#7C7C7C] text-[14px] font-[400]"
                    >
                      Plan Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-end text-xs font-medium text-[#7C7C7C] text-[14px] font-[400]"
                    >
                      Subscribed on
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-end text-xs font-medium text-[#7C7C7C] text-[14px] font-[400]"
                    >
                      Commission %
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-end text-xs font-medium text-[#7C7C7C] text-[14px] font-[400]"
                    >
                      Commission Earned
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#33333324]">
                  {refrals?.length > 0 ? (
                    refrals.map((item, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#181818] font-[400] text-[14px]">
                          {item?.referredUser?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#181818] font-[400] text-[14px]">
                          {item?.referredUser?.email?.value}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#181818] font-[400] text-[14px]">
                          {item?.subscriptionPlan}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#181818] font-[400] text-[14px]">
                          ${item?.amountPaid}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#181818] font-[400] text-[14px]">
                          {item?.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#181818] font-[400] text-[14px]">
                          {item?.referralPercentage}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#181818] font-[400] text-[14px]">
                          {item?.referralAmount}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-sm text-[#181818] font-[400] text-[14px]"
                      >
                        No data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
