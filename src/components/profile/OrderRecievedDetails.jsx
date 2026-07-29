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

const normalizeOrdersResponse = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.orders)) return payload.orders;
  if (Array.isArray(payload?.data?.orders)) return payload.data.orders;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
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

  // New API shape
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
          products[0]?.product?.seller?.pickupAddress || seller?.pickupAddress,
      });
    });
  });

  // Legacy API shape fallback
  if (!groups.length && Array.isArray(order?.products)) {
    const delivery = order.products.filter(
      (p) => p?.fulfillmentMethod?.delivery === true
    );
    const pickup = order.products.filter(
      (p) => p?.fulfillmentMethod?.delivery === false
    );
    if (delivery.length) {
      groups.push({
        key: "legacy-delivery",
        seller: delivery[0]?.product?.seller || {},
        method: "delivery",
        products: delivery,
        pickupAddress: delivery[0]?.product?.seller?.pickupAddress,
      });
    }
    if (pickup.length) {
      groups.push({
        key: "legacy-pickup",
        seller: pickup[0]?.product?.seller || {},
        method: "selfPickup",
        products: pickup,
        pickupAddress: pickup[0]?.product?.seller?.pickupAddress,
      });
    }
  }

  return groups;
};

const OrderReceivedDetails = () => {
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [openShippingModal, setOpenShippingModal] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile } = useContext(AuthContext);
  const [productId, setProductId] = useState("");

  const order = orderData || location?.state?.data;
  const status = resolveOrderStatus(order, 0, false);
  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.Processing;
  const isProcessing = status === "Processing";
  const isShipped = status === "Shipped";
  const canUpdateStatus = isProcessing || isShipped;

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

  const handleToggleFeedbackModal = (prodId) => {
    setOpenFeedbackModal(!openFeedbackModal);
    setProductId(prodId);
  };

  const applyLocalStatusUpdate = (nextStatus, extra = {}) => {
    const localUpdated = {
      ...(order || {}),
      status: nextStatus,
      ...extra,
    };
    setOrderData(localUpdated);
    navigate(location.pathname, {
      replace: true,
      state: {
        ...(location.state || {}),
        data: localUpdated,
        type: location?.state?.type || "orders-received-current",
      },
    });
  };

  const syncOrderFromApi = async (orderId) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/users/seller-orders?page=1&limit=50`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      const list = normalizeOrdersResponse(res?.data);
      const freshOrder = list.find((item) => item?._id === orderId);
      if (freshOrder) {
        setOrderData(freshOrder);
        navigate(location.pathname, {
          replace: true,
          state: {
            ...(location.state || {}),
            data: freshOrder,
            type: location?.state?.type || "orders-received-current",
          },
        });
        return freshOrder;
      }
    } catch (error) {
      // fallback to local update below
    }
    return null;
  };

  const handleOutForDelivery = async () => {
    if (!order?._id || statusUpdating) return;

    setStatusUpdating(true);
    try {
      const res = await axios.put(
        `${BASE_URL}/users/seller-order-status/${order._id}`,
        { status: "OUT_FOR_DELIVERY" },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      toast.success(
        res?.data?.message || "Order marked as out for delivery."
      );
      applyLocalStatusUpdate(
        res?.data?.data?.status || "OUT_FOR_DELIVERY",
        res?.data?.data ? { ...res.data.data } : {}
      );
      await syncOrderFromApi(order._id);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleStatusClick = () => {
    if (isProcessing) {
      setOpenShippingModal(true);
      return;
    }
    if (isShipped) {
      handleOutForDelivery();
    }
  };

  const handleShippingSuccess = async (payload = {}) => {
    const orderId = order?._id;
    const localUpdated = {
      ...(order || {}),
      status: payload?.status || "SHIPPING",
      shipment: {
        ...(order?.shipment || {}),
        shipmentName: payload?.shipmentName,
        trackingId: payload?.trackingId,
        shippingProof: payload?.shippingProof,
      },
      ...(payload?.order || {}),
    };

    setOrderData(localUpdated);
    setOpenShippingModal(false);

    navigate(location.pathname, {
      replace: true,
      state: {
        ...(location.state || {}),
        data: localUpdated,
        type: location?.state?.type || "orders-received-current",
      },
    });

    if (orderId) {
      await syncOrderFromApi(orderId);
    }
  };

  function formatDate(isoDate) {
    if (!isoDate) {
      return null;
    }
    const date = new Date(isoDate);

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  useEffect(() => {
    if (location?.state?.data) {
      setOrderData(location.state.data);
    }
  }, []);

  const buyer = order?.placerDetails;
  const buyerPhone = buyer?.phoneNumber;
  const buyerPhoneLabel = buyerPhone?.value
    ? `+${buyerPhone?.code || "1"} ${buyerPhone.value}`
    : null;

  return (
    <div className="p-5 bg-[#F7F7F7] rounded-[20px] grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="p-5 rounded-[20px] bg-white col-span-1 lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <Link to="/order-history" className="flex items-center gap-1">
            <GoArrowLeft className="text-xl light-blue-text" />
            <span className="text-sm font-medium text-gray-500">Back</span>
          </Link>
          <button
            type="button"
            onClick={handleStatusClick}
            disabled={statusUpdating || !canUpdateStatus}
            className={`inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-base font-semibold ${statusStyle.bg} ${statusStyle.text} ${
              canUpdateStatus && !statusUpdating
                ? "cursor-pointer"
                : "cursor-default"
            }`}
          >
            <span>{statusUpdating ? "Updating..." : status}</span>
            <span
              className="inline-block w-0 h-0 border-y-[5px] border-y-transparent border-l-[8px]"
              style={{ borderLeftColor: "currentColor" }}
            />
          </button>
        </div>
        <p className="font-medium text-base">
          Order ID:{" "}
          <span className="text-[#808080]">{order?._id?.substr(-7)}</span>
        </p>
        <p className="font-medium text-base mt-2">
          Order Placed:{" "}
          <span className="text-[#808080]">
            {order ? formatDate(order?.createdAt) : null}
          </span>
        </p>
        <div className="w-full mt-3">
          <h6 className="font-bold text-base">Delivery Address</h6>
          <div className="bg-[#F5F5F5] p-3.5 rounded-2xl px-4 text-sm">
            {formatAddress(order?.deliveryAddress)}
          </div>
        </div>
        <div className="w-full mt-3">
          <h6 className="font-bold text-base">Payment Method</h6>
          {order?.paymentMethod === "Card" ? (
            <div className="bg-[#fff] border p-3.5 rounded-2xl px-4 text-sm flex items-center justify-start gap-2">
              <img
                src="/mastercard-icon.png"
                alt="master-card-icon"
                className="w-[24.79px] h-[15.33px]"
              />
              <span>
                **** **** ****{" "}
                {order?.stripeCustomer?.paymentMethod?.last4 ||
                  userProfile?.stripeCustomer?.paymentMethod?.last4 ||
                  "----"}
              </span>
            </div>
          ) : (
            <div className="bg-[#fff] border p-3.5 rounded-2xl px-4 text-sm flex items-center justify-start gap-2">
              <img
                src="/wallet-icon.png"
                alt="wallet-icon.png"
                className="w-[24.79px] h-[22.33px]"
              />
              <span>
                **** **** ****{" "}
                {userProfile?.stripeConnectedAccount?.external_account?.last4 ||
                  "----"}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {sellerGroups.length > 0 ? (
            sellerGroups.map((group) => {
              const isPickup = group.method === "selfPickup";
              const sellerPhone = group.seller?.phoneNumber;
              const sellerPhoneLabel = sellerPhone?.value
                ? `+${sellerPhone?.code || "1"} ${sellerPhone.value}`
                : null;
              const chatData = {
                id: buyer?._id || order?.placer,
                lastMessage: {
                  profileImage: buyer?.profileImage,
                  profileName: buyer?.name || "Buyer",
                  id: buyer?._id || order?.placer,
                },
              };

              return (
                <div
                  key={group.key}
                  className="w-full bg-[#F9FAFA] rounded-[18px] p-5 md:p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h4 className="text-xl font-semibold text-[#333333]">
                      {buyer?.name || group.seller?.name || "Buyer"}
                    </h4>
                    {(isPickup ? sellerPhoneLabel : buyerPhoneLabel) && (
                      <div className="flex items-center gap-2 text-[#808080]">
                        <HiOutlinePhone className="text-lg" />
                        <span className="text-base font-semibold tracking-tight">
                          {isPickup ? sellerPhoneLabel : buyerPhoneLabel}
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
                            <div className="flex flex-col min-w-0">
                              <span className="text-base font-semibold text-[#333333] capitalize truncate">
                                {product?.name || "Product name here"}
                              </span>
                              <span className="text-sm text-[#9D9D9DDD]">
                                {isPickup ? "Self-Pickup" : "Delivery"}
                              </span>
                            </div>
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

                  <Link
                    to="/chats"
                    state={{ data: chatData }}
                    className="mt-5 w-full max-w-[329px] h-9 blue-bg text-white rounded-[14px] text-[14px] font-medium flex items-center justify-center"
                  >
                    Chat with Buyer
                  </Link>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-[#9D9D9D]">No products in this order.</p>
          )}
        </div>
      </div>

      {/* Order Summary + Shipment Details */}
      <div className="col-span-1 flex flex-col gap-4">
        <div className="w-full p-5 rounded-[20px] bg-white">
          <h3 className="blue-text font-bold text-[28px]">Order Summary</h3>

          <div className="w-full flex items-center justify-between mt-5">
            <span className="text-[#000000B2]">
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
            <span className="text-[#000000B2]">${order?.total}</span>
          </div>
          <div className="w-full flex items-center justify-between mt-3">
            <span className="text-[#000000B2]">Shipping Fee</span>
            <span className="text-[#000000B2]">$00.00</span>
          </div>
          <div className="border my-4" />
          <div className="w-full flex items-center justify-between">
            <span className="text-[#000000B2] font-bold">Total</span>
            <span className="text-[#000000B2] font-bold">${order?.total}</span>
          </div>
        </div>

        {(status === "Shipped" ||
          status === "Out for Delivery" ||
          status === "Delivered") &&
          (order?.shipment?.trackingId ||
            order?.shipment?.shippingProof ||
            order?.shipment?.shipmentName) && (
            <div className="w-full p-5 rounded-[20px] bg-white">
              <h3 className="blue-text font-bold text-[28px]">
                Shipment Details
              </h3>

              {order?.shipment?.shipmentName && (
                <div className="w-full flex items-start justify-between gap-3 mt-5">
                  <span className="text-[#000000B2]">Shipment Name</span>
                  <span className="font-bold text-black text-right">
                    {order.shipment.shipmentName}
                  </span>
                </div>
              )}

              {order?.shipment?.trackingId && (
                <div className="w-full flex items-start justify-between gap-3 mt-4">
                  <span className="text-[#000000B2]">Tracking Number</span>
                  <span className="font-bold text-black text-right break-all">
                    {order.shipment.trackingId}
                  </span>
                </div>
              )}

              {order?.shipment?.shippingProof && (
                <div className="w-full mt-4">
                  <span className="text-[#000000B2]">Receipt Photo</span>
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
          <div className="w-full p-5 rounded-[20px] bg-white">
            <h3 className="blue-text font-bold text-[28px]">
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
      </div>
      <FeedBackModal
        onclick={handleToggleFeedbackModal}
        openFeedbackModal={openFeedbackModal}
        data={order}
        productId={productId}
        setProductId={setProductId}
      />
      <ShippingStatusModal
        open={openShippingModal}
        onClose={() => setOpenShippingModal(false)}
        orderId={order?._id}
        onSuccess={handleShippingSuccess}
      />
    </div>
  );
};

export default OrderReceivedDetails;

const ShippingStatusModal = ({ open, onClose, orderId, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [shipmentName, setShipmentName] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [shippingProof, setShippingProof] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    setShippingProof(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClose = () => {
    setShipmentName("");
    setTrackingId("");
    setShippingProof(null);
    setPreviewUrl("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!shipmentName.trim()) {
      toast.error("Please enter shipment name.");
      return;
    }
    if (!trackingId.trim()) {
      toast.error("Please enter tracking ID.");
      return;
    }
    if (!shippingProof) {
      toast.error("Please upload shipping proof image.");
      return;
    }
    if (!orderId) {
      toast.error("Order ID not found.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("status", "SHIPPING");
      formData.append("shipmentName", shipmentName.trim());
      formData.append("trackingId", trackingId.trim());
      formData.append("shippingProof", shippingProof);

      const res = await axios.put(
        `${BASE_URL}/users/seller-order-status/${orderId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res?.data?.message || "Order marked as shipping.");
      onSuccess?.({
        status: "SHIPPING",
        shipmentName: shipmentName.trim(),
        trackingId: trackingId.trim(),
        shippingProof: res?.data?.data?.shipment?.shippingProof || previewUrl,
        order: res?.data?.data,
      });
      setShipmentName("");
      setTrackingId("");
      setShippingProof(null);
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
          Add Shipment Details
        </h3>
        <p className="text-sm text-[#5C5C5C] text-center mb-6">
          Please input the tracking number and upload a photo of the receipt
          showing the tracking number.
        </p>

        <div className="w-full mb-4">
          <label className="block text-sm font-semibold text-black mb-2">
            Status
          </label>
          <input
            type="text"
            value="SHIPPING"
            readOnly
            className="w-full border border-[#E3E3E3] rounded-2xl px-4 py-3 text-sm outline-none bg-[#F7F7F7] text-[#5C5C5C]"
          />
        </div>

        <div className="w-full mb-4">
          <label className="block text-sm font-semibold text-black mb-2">
            Shipment Name
          </label>
          <input
            type="text"
            value={shipmentName}
            onChange={(e) => setShipmentName(e.target.value)}
            placeholder="Enter shipment name"
            className="w-full border border-[#E3E3E3] rounded-2xl px-4 py-3 text-sm outline-none"
          />
        </div>

        <div className="w-full mb-4">
          <label className="block text-sm font-semibold text-black mb-2">
            Tracking ID
          </label>
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter tracking ID"
            className="w-full border border-[#E3E3E3] rounded-2xl px-4 py-3 text-sm outline-none"
          />
        </div>

        <div className="w-full mb-6">
          <label className="block text-sm font-semibold text-black mb-2">
            Shipping Proof
          </label>
          <label className="w-full min-h-[140px] border border-dashed border-[#0098EA] rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#F9FAFA] overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="shipping-proof"
                className="w-full h-[160px] object-cover"
              />
            ) : (
              <>
                <span className="text-sm font-medium text-[#0098EA]">
                  Upload Image
                </span>
                <span className="text-xs text-[#9D9D9D]">
                  PNG, JPG up to 5MB
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
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
          {loading ? <ButtonLoader /> : "Submit"}
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
    console.log("User Feedback Rating:", rating);
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

      console.log("feedback res >>>", res);
      if (res?.status === 201) {
        setShowSuccessModal(true);
        setProductId("");
        setReview("");
        setRating(0);
      }
    } catch (error) {
      console.log("err while posting feedback >>>>", error);
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
      <div className="w-full h-screen fixed inset-0 flex items-center justify-center px-4 bg-[rgba(0,0,0,0.5)]">
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
                  onClick={() => setRating(starValue)} // Set the rating
                  className={`w-[26.32px] h-[25px] cursor-pointer ${
                    starValue <= rating ? "text-yellow-500" : "text-gray-300"
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
      <div className="w-full h-screen fixed inset-0 flex items-center justify-center px-4 bg-[rgba(0,0,0,0.5)]">
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
