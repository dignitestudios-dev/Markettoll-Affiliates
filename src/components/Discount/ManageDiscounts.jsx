import React, { useContext, useEffect, useState, useMemo } from "react";
import { GoArrowLeft } from "react-icons/go";
import { FiPlus, FiTag } from "react-icons/fi";
import { LuPackage } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../api/api";
import { AuthContext } from "../../context/authContext";
import Loader from "../Global/Loader";
import DiscountCard from "./DiscountCard";
import CreateDiscount from "./CreateDiscount";

const TABS = [
  { key: "ACTIVE", label: "Active" },
  { key: "UPCOMING", label: "Upcoming" },
  { key: "EXPIRED", label: "Expired" },
];

const ManageDiscounts = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("ACTIVE");
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);

  // View mode: 'list' | 'create' | 'edit'
  const [view, setView] = useState("list");
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user?.token) {
      fetchDiscounts();
    }
  }, [user?.token]);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      // GET /users/discounts
      const res = await axios.get(`${BASE_URL}/users/discounts`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = res?.data?.data || res?.data?.discounts || res?.data || [];
      setDiscounts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Classify discounts into Active, Upcoming, Expired
  const classifiedDiscounts = useMemo(() => {
    const now = new Date();

    const active = [];
    const upcoming = [];
    const expired = [];

    discounts.forEach((d) => {
      const status = d?.status?.toUpperCase();

      if (status === "ACTIVE") {
        active.push(d);
        return;
      }
      if (status === "UPCOMING") {
        upcoming.push(d);
        return;
      }
      if (status === "EXPIRED") {
        expired.push(d);
        return;
      }

      const startDate =
        d?.startDate || d?.validFrom
          ? new Date(d?.startDate || d?.validFrom)
          : null;
      const endDate =
        d?.endDate || d?.validUntil
          ? new Date(d?.endDate || d?.validUntil)
          : null;

      if (!startDate && !endDate) {
        active.push(d);
      } else if (startDate && now < startDate) {
        upcoming.push(d);
      } else if (endDate && now > endDate) {
        expired.push(d);
      } else {
        active.push(d);
      }
    });

    return { active, upcoming, expired };
  }, [discounts]);

  const currentTabDiscounts = useMemo(() => {
    if (activeTab === "ACTIVE") return classifiedDiscounts.active;
    if (activeTab === "UPCOMING") return classifiedDiscounts.upcoming;
    if (activeTab === "EXPIRED") return classifiedDiscounts.expired;
    return [];
  }, [activeTab, classifiedDiscounts]);

  const handleEdit = (discount) => {
    setSelectedDiscount(discount);
    setView("edit");
  };

  const handlePromptDelete = (discount) => {
    setDiscountToDelete(discount);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!discountToDelete?._id) return;
    setIsDeleting(true);
    try {
      // DELETE /users/discounts/:_id
      await axios.delete(
        `${BASE_URL}/users/discounts/${discountToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      toast.success("Discount deleted successfully");
      setDeleteModalOpen(false);
      setDiscountToDelete(null);
      fetchDiscounts();
    } catch (error) {
      console.error("Error deleting discount:", error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to delete discount";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateOrUpdateSuccess = () => {
    setView("list");
    setSelectedDiscount(null);
    fetchDiscounts();
  };

  if (view === "create" || view === "edit") {
    return (
      <CreateDiscount
        editingDiscount={selectedDiscount}
        onBack={() => {
          setView("list");
          setSelectedDiscount(null);
        }}
        onSuccess={handleCreateOrUpdateSuccess}
      />
    );
  }

  return (
    <div className="padding-x w-full py-6">
      <div className="w-full bg-[#F7F7F7] rounded-[30px] p-6 lg:p-10 min-h-[85vh] flex flex-col justify-between">
        <div>
          {/* Top Bar */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/60">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-[#5C5C5C] hover:text-black transition-colors"
              >
                <GoArrowLeft className="light-blue-text text-2xl" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <div>
                <h2 className="blue-text font-bold text-[24px] md:text-[28px]">
                  Manage Discounts
                </h2>
                <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                  Create and manage special promotions & discounts for your products
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedDiscount(null);
                setView("create");
              }}
              className="blue-bg hover:bg-[#0086d1] text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 text-sm"
            >
              <FiPlus className="text-lg" />
              <span>Create Discount</span>
            </button>
          </div>

          {/* Filter Tabs Bar */}
          <div className="flex items-center gap-2 mt-6">
            <div className="bg-white p-1 rounded-xl border border-gray-200 flex items-center gap-1 shadow-xs">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                const count =
                  tab.key === "ACTIVE"
                    ? classifiedDiscounts.active.length
                    : tab.key === "UPCOMING"
                    ? classifiedDiscounts.upcoming.length
                    : classifiedDiscounts.expired.length;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-5 py-2 rounded-lg font-bold text-xs md:text-sm transition-all flex items-center gap-2 ${
                      isActive
                        ? "blue-bg text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid of Discounts */}
          <div className="mt-8">
            {loading ? (
              <div className="py-24 flex justify-center items-center">
                <Loader />
              </div>
            ) : currentTabDiscounts.length === 0 ? (
              <div className="w-full min-h-[45vh] bg-white rounded-2xl p-12 border border-gray-100 flex flex-col items-center justify-center text-center shadow-xs">
                <div className="w-20 h-20 rounded-full bg-[#E5F6FD] flex items-center justify-center text-[#0098EA] mb-4">
                  <FiTag className="w-9 h-9" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  No {activeTab.toLowerCase()} discounts
                </h3>
                <p className="text-xs md:text-sm text-gray-500 mt-1 max-w-md">
                  {activeTab === "ACTIVE"
                    ? "You currently have no active discounts running. Create one to boost your product sales!"
                    : activeTab === "UPCOMING"
                    ? "No upcoming discounts scheduled."
                    : "No expired discounts found."}
                </p>
                {activeTab === "ACTIVE" && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDiscount(null);
                      setView("create");
                    }}
                    className="mt-6 blue-bg hover:bg-[#0086d1] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
                  >
                    <FiPlus className="text-base" />
                    Create Your First Discount
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentTabDiscounts.map((discount) => (
                  <DiscountCard
                    key={discount._id}
                    discount={discount}
                    onEdit={handleEdit}
                    onDelete={handlePromptDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative flex flex-col items-center text-center border border-gray-100">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <IoClose className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 rounded-full bg-red-100 text-[#E05353] flex items-center justify-center mb-3">
              <IoClose className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Delete Discount</h3>
            <p className="text-xs text-gray-500 mt-2">
              Are you sure you want to delete this discount? This will remove the promotional pricing from selected products.
            </p>
            <div className="flex items-center gap-3 mt-6 w-full">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-[#E05353] hover:bg-red-600 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDiscounts;
