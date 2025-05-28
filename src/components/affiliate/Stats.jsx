import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";

export default function Stats() {
    const { user} = useContext(AuthContext);
  const [analytics,setAnalitics] = useState([]);
  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/influencer/analytics`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });      
      console.log(res)
      setAnalitics(res?.data?.data);
    } catch (error) {
      console.log(
        "error while fetching notifications >>>",
        error?.response?.data
      );
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);
console.log(analytics,"analytics")
  const statsData = [
    {
      name: "Total Referrals",
      value:analytics?.totalReferrals,
      icon: "/referal.png",
    },
    {
      name: "Conversion Rate",
      value:analytics?.conversionRate,
      icon: "/commision.png",
    },
    {
      name: "Total Commission",
      value:analytics?.totalCommission,
      icon: "/payout.png",
    },
    {
      name: "Total Payout",
      value:analytics?.totalPayouts,
      icon: "/payout.png",
    },
  ];

  return (
    <>
      {/* https://codepen.io/robstinson/pen/MWexYPG */}
      <div className="flex items-center justify-center mt-10 ">
        {/* Component Start */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 w-full ">
          {/* Tile 1 */}
          {statsData?.map((item, i) => (
            <div
              key={i}
              className="flex items-center p-4 bg-[#0098EA14] rounded-[30px]"
            >
              <div className="flex flex-shrink-0 items-center justify-center h-16 w-16 rounded">
                <img src={item?.icon} alt="" />
              </div>
              <div className="flex-grow flex flex-col ml-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">{item?.name}</span>
                </div>
                <span className="text-xl font-bold">{item?.value}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Component End  */}
      </div>
    </>
  );
}
