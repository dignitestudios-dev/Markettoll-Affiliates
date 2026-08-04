export const ORDER_STATUS_TABS = [
  "All",
  "Processing",
  "Shipped",
  "Out for delivery",
  "Delivered",
];

export const STATUS_STYLES = {
  Processing: {
    bg: "bg-[rgba(125,114,241,0.15)]",
    text: "text-[#7D72F1]",
  },
  Shipped: {
    bg: "bg-[rgba(16,203,255,0.15)]",
    text: "text-[#10CBFF]",
  },
  "Out for Delivery": {
    bg: "bg-[rgba(255,109,8,0.15)]",
    text: "text-[#FF6D08]",
  },
  Delivered: {
    bg: "bg-[rgba(32,189,74,0.15)]",
    text: "text-[#20BD4A]",
  },
};

const STATUS_CYCLE = [
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

/** Normalize API / display status labels */
export const normalizeStatus = (raw) => {
  if (!raw) return null;
  const value = String(raw).trim().toLowerCase().replace(/[_-]/g, " ");

  if (value.includes("process")) return "Processing";
  if (value.includes("ship")) return "Shipped";
  if (value.includes("out for") || value.includes("outfordelivery")) {
    return "Out for Delivery";
  }
  if (value.includes("deliver")) return "Delivered";
  if (value.includes("cancel")) return "Cancelled";

  return null;
};

export const resolveOrderStatus = (order, index = 0, isPast = false) => {
  if (isPast) return "Delivered";

  const candidates = [
    order?.orderStatus,
    order?.status,
    order?.deliveryStatus,
    order?.fulfillmentStatus,
    order?.trackingStatus,
    order?.shipment?.status,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeStatus(candidate);
    if (normalized && STATUS_STYLES[normalized]) return normalized;
  }

  // No fake fallback when order exists with unknown/empty status
  if (order?._id && !candidates.some(Boolean)) {
    return "Processing";
  }

  if (order?._id) return "Processing";

  return STATUS_CYCLE[index % STATUS_CYCLE.length];
};

export const statusMatchesTab = (status, tab) => {
  if (!tab || tab === "All") return true;
  if (tab === "Out for delivery") return status === "Out for Delivery";
  return status === tab;
};

export const extractPlacedProducts = (order) => {
  const products = [];

  order?.sellersProducts?.forEach((sellerProduct) => {
    sellerProduct?.fulfillmentMethods?.forEach((fulfillment) => {
      fulfillment?.products?.forEach((pro) => {
        products.push({
          id: pro?.product?._id,
          name: pro?.product?.name || "Product name here",
          image:
            pro?.product?.images?.find((img) => img?.displayImage)?.url ||
            pro?.product?.images?.[0]?.url,
          price: pro?.product?.price,
          fulfillmentLabel:
            fulfillment?.method === "delivery" ||
            pro?.fulfillmentMethod?.delivery
              ? "Delivery"
              : "Self-Pickup",
          seller: pro?.product?.seller || sellerProduct?.seller,
        });
      });
    });
  });

  if (products.length > 0) return products;

  if (Array.isArray(order?.products) && order.products.length > 0) {
    return order.products.map(mapProductItem);
  }

  if (Array.isArray(order?.items) && order.items.length > 0) {
    return order.items.map(mapProductItem);
  }

  if (Array.isArray(order?.orderItems) && order.orderItems.length > 0) {
    return order.orderItems.map(mapProductItem);
  }

  return products;
};

const mapProductItem = (item) => {
  const product = item?.product || item;
  const selfPickup =
    product?.fulfillmentMethod?.selfPickup ||
    item?.fulfillmentMethod?.selfPickup ||
    item?.fulfillmentMethod === "selfPickup";

  return {
    id: product?._id || item?._id,
    name: product?.name || item?.name || "Product name here",
    image:
      product?.images?.[0]?.url ||
      item?.images?.[0]?.url ||
      product?.image ||
      item?.image,
    price: product?.price ?? item?.price ?? item?.amount,
    fulfillmentLabel: selfPickup ? "Self Pickup" : "Delivery",
    seller: product?.seller || item?.seller,
  };
};

export const extractReceivedProducts = (order) => {
  if (Array.isArray(order?.products) && order.products.length > 0) {
    return order.products.map(mapProductItem);
  }

  if (Array.isArray(order?.items) && order.items.length > 0) {
    return order.items.map(mapProductItem);
  }

  if (Array.isArray(order?.orderItems) && order.orderItems.length > 0) {
    return order.orderItems.map(mapProductItem);
  }

  return extractPlacedProducts(order);
};
