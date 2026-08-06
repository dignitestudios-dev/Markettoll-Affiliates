import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { IoIosStar } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";
import { HiOutlinePhone } from "react-icons/hi";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BASE_URL } from "../../api/api";
import { toast } from "react-toastify";
import ButtonLoader from "../Global/ButtonLoader";
import { resolveOrderStatus, STATUS_STYLES } from "./orderTrackingUtils";
import {
  db,
  collection,
  doc,
  query,
  getDocs,
  updateDoc,
  deleteDoc,
} from "../../firebase/firebase";
import { where } from "firebase/firestore";

const formatDate = (isoDate) => {
  if (!isoDate) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(isoDate));
};

const formatAddress = (address) => {
  if (!address) return "—";
  return [
    address.apartment_suite,
    address.streetAddress,
    address.city,
    address.state,
    address.zipCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
};

const getProductImage = (product) => {
  const images = product?.images || [];
  const display = images.find((img) => img?.displayImage);
  return display?.url || images[0]?.url || "";
};

const buildSellerGroups = (order) => {
  const groups = [];

  order?.sellersProducts?.forEach((sellerProduct) => {
    const seller = sellerProduct?.seller || {};
    sellerProduct?.fulfillmentMethods?.forEach((fulfillment) => {
      const products = (fulfillment?.products || []).filter(Boolean);
      if (!products.length) return;

      groups.push({
        key: `${seller?.id || seller?._id}-${fulfillment?.method}`,
        seller,
        method: fulfillment?.method,
        products,
        pickupAddress:
          products[0]?.product?.seller?.pickupAddress ||
          seller?.pickupAddress,
      });
    });
  });

  return groups;
};

const OrderDetails = () => {
  const { user } = useContext(AuthContext);

  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [openConfirmDeliveryModal, setOpenConfirmDeliveryModal] =
    useState(false);
  const [productId, setProductId] = useState("");
  const [orderData, setOrderData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const order = orderData || location?.state?.data;

  const status = resolveOrderStatus(order, 0, false);
  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.Processing;

  // Delete chat room in Firestore when order is Delivered
  useEffect(() => {
    const isDelivered =
      status === "Delivered" ||
      order?.status === "DELIVERED" ||
      order?.status === "Delivered";

    if (!isDelivered || !order) return;

    const orderIdToFind = order?.orderId;
    const orderObjIdToFind = order?._id;

    const deleteChatForDeliveredOrder = async () => {
      try {
        const chatRef = collection(db, "chat-v2");
        let docsToDelete = [];

        if (orderIdToFind) {
          const q1 = query(chatRef, where("order_id", "==", orderIdToFind));
          const snap1 = await getDocs(q1);
          docsToDelete.push(...snap1.docs);
        }

        if (orderObjIdToFind) {
          const q2 = query(chatRef, where("order_id", "==", orderObjIdToFind));
          const snap2 = await getDocs(q2);
          docsToDelete.push(...snap2.docs);
        }

        const uniqueDocs = Array.from(
          new Map(docsToDelete.map((docSnap) => [docSnap.id, docSnap])).values()
        );

        for (const docSnap of uniqueDocs) {
          try {
            await updateDoc(doc(db, "chat-v2", docSnap.id), {
              chat_status: false,
            });
            await deleteDoc(doc(db, "chat-v2", docSnap.id));
            console.log("Chat room deleted for delivered order:", docSnap.id);
          } catch (err) {
            console.error("Error updating/deleting chat doc:", err);
          }
        }
      } catch (error) {
        console.error("Error querying chat room for delivered order:", error);
      }
    };

    deleteChatForDeliveredOrder();
  }, [status, order?.status, order?.orderId, order?._id]);

  const sellerGroups = useMemo(() => buildSellerGroups(order), [order]);

  const itemCount = useMemo(() => {
    return sellerGroups.reduce(
      (sum, group) =>
        sum +
        group.products.reduce(
          (inner, item) => inner + Number(item?.quantity || 1),
          0
        ),
      0
    );
  }, [sellerGroups]);

  const subtotal = useMemo(() => {
    const fromProducts = sellerGroups.reduce((sum, group) => {
      return (
        sum +
        group.products.reduce((inner, item) => {
          const price = Number(item?.product?.price || 0);
          const qty = Number(item?.quantity || 1);
          return inner + price * qty;
        }, 0)
      );
    }, 0);

    return Number(order?.total ?? fromProducts);
  }, [sellerGroups, order]);

  const cardLast4 =
    order?.stripeCustomer?.paymentMethod?.last4 ||
    order?.paymentMethodLast4 ||
    "";

  const canMarkReceived = status === "Out for Delivery";

  const handleToggleFeedbackModal = (prodId) => {
    setOpenFeedbackModal((prev) => !prev);
    setProductId(prodId);
  };

  const handleConfirmDeliverySuccess = (payload = {}) => {
    const updated = {
      ...(order || {}),
      status: payload?.status || "DELIVERED",
      delivery: {
        ...(order?.delivery || {}),
        deliveryProof:
          payload?.deliveryProof || order?.delivery?.deliveryProof,
        deliveredAt: payload?.deliveredAt || new Date().toISOString(),
      },
      ...(payload?.order || {}),
    };

    setOrderData(updated);
    setOpenConfirmDeliveryModal(false);
    navigate(location.pathname, {
      replace: true,
      state: {
        ...(location.state || {}),
        data: updated,
        type: location?.state?.type || "current-orders",
      },
    });
  };

  if (!order) {
    return (
      <div className="w-full p-5 bg-[#F7F7F7] rounded-[30px]">
        <div className="bg-white rounded-[18px] p-6">
          <button
            type="button"
            onClick={() => navigate("/order-history")}
            className="flex items-center gap-1 mb-4"
          >
            <GoArrowLeft className="text-[#0098EA] text-xl" />
            <span className="text-sm font-medium text-[#5C5C5C]">Back</span>
          </button>
          <h2 className="blue-text text-xl font-bold">Order not found</h2>
        </div>
      </div>
    );
  }

  console.log(order, "order====>")
  return (
    <div className="w-full p-4 md:p-5 bg-[#F7F7F7] rounded-[30px]">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_391px] gap-4 md:gap-5 items-start">
        {/* Left panel */}
        <div className="bg-white rounded-[18px] p-5 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate("/order-history")}
              className="flex items-center gap-1"
            >
              <GoArrowLeft className="text-[#0098EA] text-xl" />
              <span className="text-sm font-medium text-[#5C5C5C]">Back</span>
            </button>
            <span
              className={`inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-base font-semibold ${statusStyle.bg} ${statusStyle.text}`}
            >
              <span>{status}</span>
              <span
                className="inline-block w-0 h-0 border-y-[5px] border-y-transparent border-l-[8px]"
                style={{ borderLeftColor: "currentColor" }}
              />
            </span>
          </div>

          <p className="mt-5 text-base font-medium text-black tracking-tight">
            Order ID: {order?.orderId}
          </p>
          <p className="mt-3 text-base font-medium text-black tracking-tight">
            Order Placed: {formatDate(order?.createdAt)}
          </p>

          <div className="mt-5">
            <h6 className="font-bold text-base text-black mb-2">
              Delivery Address
            </h6>
            <div className="w-full bg-[#F5F5F5] rounded-[20px] px-3.5 py-3.5 text-sm text-[rgba(0,0,0,0.7)]">
              {formatAddress(order?.deliveryAddress)}
            </div>
          </div>

          <div className="mt-5">
            <h6 className="font-bold text-base text-black mb-2">
              Payment Method
            </h6>
            <div className="w-full border border-[#E3E3E3] rounded-[20px] px-5 py-3.5 flex items-center gap-3">
              {order?.paymentMethod === "Card" ? (
                <img
                  src="/mastercard-icon.png"
                  alt="card"
                  className="w-[25px] h-[15px] object-contain"
                />
              ) : (
                <img
                  src="/wallet-icon.png"
                  alt="wallet"
                  className="w-[25px] h-[22px] object-contain"
                />
              )}
              <span className="text-sm text-[#5C5C5C]">
                **** **** **** {cardLast4 || "----"}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {sellerGroups.length > 0 ? (
              sellerGroups.map((group) => {
                const sellerId = group.seller?.id || group.seller?._id;
                const phone = group.seller?.phoneNumber;
                const phoneLabel = phone?.value
                  ? `+${phone?.code || "1"} ${phone.value}`
                  : null;
                const isPickup = group.method === "selfPickup";
                const chatData = {
                  id: sellerId,
                  adminId: "admin_id",
                  userName: user?.name,
                  orderId: order?.orderId || "",
                  lastMessage: {
                    profileImage:
                      group.products[0]?.product?.seller?.profileImage,
                    profileName: group.seller?.name || "Admin",
                    id: sellerId,
                  },
                };


                return (
                  <div
                    key={group.key}
                    className="w-full bg-[#F9FAFA] rounded-[18px] p-5 md:p-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <h4 className="text-xl font-semibold text-[#333333]">
                        {group.seller?.name || "Seller Name"}
                      </h4>
                      {isPickup && phoneLabel && (
                        <div className="flex items-center gap-2 text-[#808080]">
                          <HiOutlinePhone className="text-lg" />
                          <span className="text-base font-semibold tracking-tight">
                            {phoneLabel}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-4">
                      {group.products.map((item) => {
                        const product = item?.product || {};
                        return (
                          <div
                            key={item?._id || product?._id}
                            className="flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              {getProductImage(product) ? (
                                <img
                                  src={getProductImage(product)}
                                  alt={product?.name || "product"}
                                  className="w-20 h-20 rounded-[15px] object-cover shrink-0 bg-white"
                                />
                              ) : (
                                <div className="w-20 h-20 rounded-[15px] shrink-0 bg-[#E8E8E8]" />
                              )}
                              <span className="text-base font-semibold text-[#333333] capitalize truncate">
                                {product?.name || "Product name here"}
                              </span>
                            </div>
                            <span className="text-xl font-semibold text-[#003DAC] shrink-0">
                              ${Number(product?.price || 0).toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <p className="mt-5 text-xl font-semibold text-[#333333] capitalize">
                      {isPickup
                        ? `pickup address: ${formatAddress(group.pickupAddress)}`
                        : "Delivered to your address."}
                    </p>

                    {status !== "Delivered" &&
                      status?.toLowerCase() !== "delivered" &&
                      order?.status !== "DELIVERED" &&
                      order?.status !== "Delivered" && (
                        <Link
                          to="/chats"
                          state={{ data: chatData }}
                          className="mt-5 w-full max-w-[329px] h-9 blue-bg text-white rounded-[14px] text-[14px] font-medium flex items-center justify-center"
                        >
                          Chat with Admin
                        </Link>
                    )}

                    {status === "Delivered" &&
                      group.products.map((item) =>
                        !item?.hasReviewed ? (
                          <button
                            key={`fb-${item?._id}`}
                            type="button"
                            onClick={() =>
                              handleToggleFeedbackModal(item?._id)
                            }
                            className="mt-3 text-sm font-semibold text-[#0098EA]"
                          >
                            Give Feedback — {item?.product?.name}
                          </button>
                        ) : null
                      )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-[#9D9D9D]">No products in this order.</p>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-[18px] p-5 md:p-6">
            <h3 className="text-[28px] leading-[35px] font-bold text-[#003DAC] tracking-tight capitalize">
              Order Summary
            </h3>

            <div className="mt-8 flex items-center justify-between text-base text-[rgba(0,0,0,0.7)]">
              <span>
                Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="border-t border-[#D6D6D6] my-4" />

            <div className="flex items-center justify-between text-base font-bold text-black">
              <span>Total</span>
              <span>${Number(order?.total ?? subtotal).toFixed(2)}</span>
            </div>
          </div>

          {(order?.shipment?.trackingId ||
            order?.shipment?.shippingProof ||
            order?.shipment?.shipmentName) && (
              <div className="bg-white rounded-[18px] p-5 md:p-6">
                <h3 className="text-[28px] leading-[35px] font-bold text-[#003DAC] tracking-tight capitalize">
                  Shipment Details
                </h3>

                {order?.shipment?.shipmentName && (
                  <div className="w-full flex items-start justify-between gap-3 mt-5">
                    <span className="text-[rgba(0,0,0,0.7)]">Shipment Name</span>
                    <span className="font-bold text-black text-right">
                      {order.shipment.shipmentName}
                    </span>
                  </div>
                )}

                {order?.shipment?.trackingId && (
                  <div className="w-full flex items-start justify-between gap-3 mt-4">
                    <span className="text-[rgba(0,0,0,0.7)]">Tracking Number</span>
                    <span className="font-bold text-black text-right break-all">
                      {order.shipment.trackingId}
                    </span>
                  </div>
                )}

                {order?.shipment?.shippingProof && (
                  <div className="w-full mt-4">
                    <span className="text-[rgba(0,0,0,0.7)]">Receipt Photo</span>
                    <div className="mt-3 w-full max-w-[180px] ml-auto border border-[#E3E3E3] rounded-[12px] overflow-hidden bg-white">
                      <img
                        src={order.shipment.shippingProof}
                        alt="shipping-proof"
                        className="w-full h-[140px] object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

          {status === "Delivered" && order?.delivery?.deliveryProof && (
            <div className="bg-white rounded-[18px] p-5 md:p-6">
              <h3 className="text-[28px] leading-[35px] font-bold text-[#003DAC] tracking-tight capitalize">
                Proof of Delivery
              </h3>
              <div className="mt-5 w-full flex justify-start">
                <div className="w-[110px] h-[110px] border border-[#E3E3E3] rounded-[12px] overflow-hidden bg-white">
                  <img
                    src={order.delivery.deliveryProof}
                    alt="delivery-proof"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {status !== "Delivered" && (
            <button
              type="button"
              disabled={!canMarkReceived}
              onClick={() => {
                if (canMarkReceived) setOpenConfirmDeliveryModal(true);
              }}
              className={`w-full h-12 rounded-[20px] text-sm font-bold text-white ${canMarkReceived
                ? "bg-[#0098EA]"
                : "bg-[#B4B5B6] cursor-not-allowed"
                }`}
            >
              Mark as Received
            </button>
          )}
        </div>
      </div>

      <FeedBackModal
        onclick={handleToggleFeedbackModal}
        openFeedbackModal={openFeedbackModal}
        data={order}
        productId={productId}
        setProductId={setProductId}
      />
      <ConfirmDeliveryModal
        open={openConfirmDeliveryModal}
        onClose={() => setOpenConfirmDeliveryModal(false)}
        orderId={order?._id}
        onSuccess={handleConfirmDeliverySuccess}
      />
    </div>
  );
};

export default OrderDetails;

const ConfirmDeliveryModal = ({ open, onClose, orderId, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [deliveryProof, setDeliveryProof] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValidType =
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png";
    if (!isValidType) {
      toast.error("Only JPG and PNG images are allowed.");
      return;
    }

    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image must be up to 20MB.");
      return;
    }

    setDeliveryProof(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClose = () => {
    setDeliveryProof(null);
    setPreviewUrl("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!deliveryProof) {
      toast.error("Please upload delivery proof image.");
      return;
    }
    if (!orderId) {
      toast.error("Order ID not found.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("deliveryProof", deliveryProof);

      const res = await axios.post(
        `${BASE_URL}/users/confirm-delivery/${orderId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res?.data?.message || "Delivery confirmed successfully.");
      onSuccess?.({
        status: res?.data?.data?.status || "DELIVERED",
        deliveryProof:
          res?.data?.data?.delivery?.deliveryProof ||
          res?.data?.data?.deliveryProof ||
          previewUrl,
        deliveredAt: res?.data?.data?.delivery?.deliveredAt,
        order: res?.data?.data,
      });
      setDeliveryProof(null);
      setPreviewUrl("");
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="w-full h-screen fixed inset-0 flex items-center justify-center px-4 bg-[rgba(0,0,0,0.5)] z-50">
      <div className="bg-white w-full max-w-[520px] rounded-xl py-7 px-6 md:px-8 relative">
        <button
          type="button"
          onClick={handleClose}
          className="w-6 h-6 bg-[#F7F7F7] rounded-full p-1 absolute top-5 right-5"
        >
          <IoClose className="w-full h-full" />
        </button>

        <h3 className="text-xl font-bold blue-text text-center mb-1">
          Confirmation of Delivery
        </h3>
        <p className="text-sm text-[#5C5C5C] text-center mb-6">
          Please confirm that you have received your order. This action will
          complete the order.
        </p>

        <div className="w-full mb-6">
          <label className="block text-sm font-semibold text-black mb-2">
            Upload Image
          </label>
          <label className="w-full min-h-[140px] border border-dashed border-[#0098EA] rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#F9FAFA] overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="delivery-proof"
                className="w-full h-[160px] object-cover"
              />
            ) : (
              <>
                <span className="text-sm font-medium text-[#0098EA]">
                  Upload Image
                </span>
                <span className="text-xs text-[#9D9D9D]">
                  Upto 20mbs JPG, PNG
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="py-3 w-full text-center blue-bg text-white text-sm font-bold rounded-2xl"
        >
          {loading ? <ButtonLoader /> : "Confirm Delivery"}
        </button>
      </div>
    </div>
  );
};

const FeedBackModal = ({
  onclick,
  openFeedbackModal,
  data,
  productId,
  setProductId,
}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [rating, setRating] = useState(0);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState("");

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onclick();
  };

  const handleSubmitFeedback = async () => {
    if (!review) {
      toast.error("Please write a review.");
      return;
    }
    if (!productId || !data) {
      toast.error("Something went wrong.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/users/product-review/${data?._id}/${productId}`,
        {
          rating: rating,
          description: review,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (res?.status === 201) {
        setShowSuccessModal(true);
        setProductId("");
        setReview("");
        setRating(0);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      onclick();
      setProductId("");
      setReview("");
      setRating(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    openFeedbackModal && (
      <div className="w-full h-screen fixed inset-0 flex items-center justify-center px-4 bg-[rgba(0,0,0,0.5)] z-50">
        <div className="bg-white w-full lg:w-[611px] h-[398px] rounded-xl py-7 px-10 relative flex flex-col items-center justify-center gap-3">
          <button
            type="button"
            onClick={onclick}
            className="w-6 h-6 bg-[#F7F7F7] rounded-full p-1 absolute top-5 right-5"
          >
            <IoClose className="w-full h-full" />
          </button>
          <h3 className="text-xl font-bold blue-text">Give Feedback</h3>
          <p className="text-lg font-medium text-[#5C5C5C]">
            How was your experience?
          </p>
          <div className="w-[171.06px] flex items-center justify-between">
            {Array.from({ length: 5 }, (_, index) => {
              const starValue = index + 1;
              return (
                <IoIosStar
                  key={starValue}
                  onClick={() => setRating(starValue)}
                  className={`w-[26.32px] h-[25px] cursor-pointer ${starValue <= rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                />
              );
            })}
          </div>

          <div className="w-full">
            <textarea
              name="feedback"
              id="feedback"
              rows={5}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your Review here"
              className="border rounded-2xl p-3 text-sm outline-none w-full mb-3 text-[#5C5C5C]"
            ></textarea>
            <button
              type="button"
              onClick={handleSubmitFeedback}
              className="py-3 w-full text-center blue-bg text-white text-sm font-bold rounded-2xl"
            >
              {loading ? <ButtonLoader /> : "Submit"}
            </button>
          </div>
        </div>

        <SuccessModal
          showSuccessModal={showSuccessModal}
          onclick={handleCloseSuccessModal}
        />
      </div>
    )
  );
};

const SuccessModal = ({ showSuccessModal, onclick }) => {
  return (
    showSuccessModal && (
      <div className="w-full h-screen fixed inset-0 flex items-center justify-center px-4 bg-[rgba(0,0,0,0.5)] z-[60]">
        <div className="bg-white w-full lg:w-[440px] h-[201px] rounded-xl py-7 px-10 relative flex flex-col items-center justify-center gap-3">
          <button
            type="button"
            onClick={onclick}
            className="w-6 h-6 bg-[#F7F7F7] rounded-full p-1 absolute top-5 right-5"
          >
            <IoClose className="w-full h-full" />
          </button>
          <div className="blue-bg w-[69.67px] h-[69.67px] rounded-full p-3">
            <FaCheck className="text-white w-full h-full" />
          </div>
          <h3 className="text-xl font-bold blue-text">
            Thank you for your feedback
          </h3>
        </div>
      </div>
    )
  );
};
