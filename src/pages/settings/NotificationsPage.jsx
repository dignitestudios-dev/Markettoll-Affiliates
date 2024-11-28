import React from "react";

const NotificationsPage = () => {
  return (
    <div className="px-0 md:px-5">
      <h2 className="blue-text text-[28px] font-bold">Notifications</h2>
      <div className="border w-full mt-4" />

      <div className="w-full flex items-center justify-between gap-4 custom-shadow p-5 rounded-2xl mt-5">
        <div className="flex flex-col items-start gap-1">
          <span className="text-base font-medium">New Product Alerts</span>
          <span className="text-sm">
            Receive instant alerts on your device for newly listed products
            matching your interests.
          </span>
        </div>
        <div>
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" class="sr-only peer" />
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-500 dark:peer-focus:ring-[#34C759] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
          </label>
        </div>
      </div>

      <div className="w-full flex items-center justify-between gap-4 custom-shadow p-5 rounded-2xl mt-5">
        <div className="flex flex-col items-start gap-1">
          <span className="text-base font-medium">Order Updates</span>
          <span className="text-sm">
            Stay informed about the status of your orders, including
            confirmations, shipments, and deliveries.
          </span>
        </div>
        <div>
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" class="sr-only peer" />
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-500 dark:peer-focus:ring-[#34C759] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
          </label>
        </div>
      </div>

      <div className="w-full flex items-center justify-between gap-4 custom-shadow p-5 rounded-2xl mt-5">
        <div className="flex flex-col items-start gap-1">
          <span className="text-base font-medium">Price Drop Alerts</span>
          <span className="text-sm">
            Get notified when the price of a product you're interested in drops.
          </span>
        </div>
        <div>
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" class="sr-only peer" />
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-500 dark:peer-focus:ring-[#34C759] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
          </label>
        </div>
      </div>

      <div className="w-full flex items-center justify-between gap-4 custom-shadow p-5 rounded-2xl mt-5">
        <div className="flex flex-col items-start gap-1">
          <span className="text-base font-medium">Wishlist Updates</span>
          <span className="text-sm">
            Receive alerts when a product on your wishlist becomes available or
            goes on sale
          </span>
        </div>
        <div>
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" class="sr-only peer" />
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-500 dark:peer-focus:ring-[#34C759] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
          </label>
        </div>
      </div>

      <div className="w-full flex items-center justify-between gap-4 custom-shadow p-5 rounded-2xl mt-5">
        <div className="flex flex-col items-start gap-1">
          <span className="text-base font-medium">Seller Messages</span>
          <span className="text-sm">
            Get instant alerts for inquiries, messages, and updates related to
            your listed products.
          </span>
        </div>
        <div>
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" class="sr-only peer" />
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-500 dark:peer-focus:ring-[#34C759] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34C759]"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
