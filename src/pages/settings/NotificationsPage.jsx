import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";

const NotificationsPage = () => {
  const { userProfile, user, fetchUserProfile } = useContext(AuthContext);

  const [notificationSettings, setNotificationSettings] = useState({
    boostedProductsAndServices: false,
    wishlistItems: false,
    chatMessages: false,
    customerSupport: false,
  });

  useEffect(() => {
    if (userProfile?.pushNotificationOptions) {
      setNotificationSettings({
        boostedProductsAndServices:
          userProfile.pushNotificationOptions.boostedProductsAndServices ??
          false,
        wishlistItems:
          userProfile.pushNotificationOptions.wishlistItems ?? false,
        chatMessages: userProfile.pushNotificationOptions.chatMessages ?? false,
        customerSupport:
          userProfile.pushNotificationOptions.customerSupport ?? false,
      });
    }
  }, [userProfile]);

  const handleChange = async (settingKey) => {
    const updatedSettings = {
      ...notificationSettings,
      [settingKey]: !notificationSettings[settingKey],
    };
    console.log("updatedNotes >>", updatedSettings);

    setNotificationSettings(updatedSettings);

    try {
      const res = await axios.put(
        `${BASE_URL}/users/push-notification-options`,
        updatedSettings,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      console.log("Notification setting updated successfully!", res);

      if (res?.status === 200) {
        fetchUserProfile();
      }
    } catch (error) {
      console.error("Error updating notification setting:", error);
    }
  };

  return (
    <div className="px-0 md:px-5">
      <h2 className="blue-text text-[28px] font-bold">Notifications</h2>
      <div className="border w-full mt-4" />

      <div className="w-full flex items-center justify-between gap-4 custom-shadow p-5 rounded-2xl mt-5">
        <div className="flex flex-col items-start gap-1">
          <span className="text-base font-medium">Product Alerts</span>
          <span className="text-sm">
            Receive instant alerts on your device for newly listed products
            matching your interests.
          </span>
        </div>
        <div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={
                userProfile?.pushNotificationOptions.boostedProductsAndServices
              }
              onChange={() => handleChange("boostedProductsAndServices")}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-500 dark:peer-focus:ring-[#34C759] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
          </label>
        </div>
      </div>

      {/* Wishlist Updates */}
      <div className="w-full flex items-center justify-between gap-4 custom-shadow p-5 rounded-2xl mt-5">
        <div className="flex flex-col items-start gap-1">
          <span className="text-base font-medium">Wishlist Updates</span>
          <span className="text-sm">
            Receive alerts when a product on your wishlist becomes available or
            goes on sale
          </span>
        </div>
        <div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={userProfile?.pushNotificationOptions.wishlistItems}
              onChange={() => handleChange("wishlistItems")}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-500 dark:peer-focus:ring-[#34C759] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
          </label>
        </div>
      </div>

      {/* Seller Messages */}
      <div className="w-full flex items-center justify-between gap-4 custom-shadow p-5 rounded-2xl mt-5">
        <div className="flex flex-col items-start gap-1">
          <span className="text-base font-medium">Seller Messages</span>
          <span className="text-sm">
            Get instant alerts for inquiries, messages, and updates related to
            your listed products.
          </span>
        </div>
        <div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={userProfile?.pushNotificationOptions.chatMessages}
              onChange={() => handleChange("chatMessages")}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-500 dark:peer-focus:ring-[#34C759] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
          </label>
        </div>
      </div>

      {/* Customer Support */}
      <div className="w-full flex items-center justify-between gap-4 custom-shadow p-5 rounded-2xl mt-5">
        <div className="flex flex-col items-start gap-1">
          <span className="text-base font-medium">Customer Support</span>
          <span className="text-sm">
            Stay informed about the status of your orders, including
            confirmations, shipments, and deliveries.
          </span>
        </div>
        <div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={userProfile?.pushNotificationOptions.customerSupport}
              onChange={() => handleChange("customerSupport")}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-500 dark:peer-focus:ring-[#34C759] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
