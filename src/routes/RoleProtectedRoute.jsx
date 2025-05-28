import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext";

// Utility to match dynamic paths like /product/:id
const pathMatches = (pattern, path) => {
  const regexPattern = new RegExp(
    "^" + pattern.replace(/:\w+/g, "[^/]+") + "$"
  );
  return regexPattern.test(path);
};

const allowedPathsForRoles = {
  influencer: ["/account/peronal-info", "/account/my-wallet", "/affiliate"],
  client: [
    "/",
    "/search-product",
    "/subscriptions",
    "/subscriptions/add-payment-details",
    "/profile-setup",
    "/review-profile-image",
    "/add-location",
    "/add-service-or-product",
    "/add-product",
    "/product-review",
    "/would-you-boost-your-product",
    "/add-service",
    "/service-review",
    "/boost-service",
    "/choose-package-to-boost-service",
    "/boost-post",
    "/categories/:category",
    "/categories",
    "/home/:category/:category",
    "/categories/:category/:subCategory",
    "/products/:productId",
    "/edit-product/:productId",
    "/services/:serviceId",
    "/services/edit-service/:serviceId",
    "/seller-profile/:sellerId",
    "/cart",
    "/order-details/:orderId",
    "/chats",
    "/favourites",
    "/account/peronal-info",
    "/account/my-wallet",
    "/account/my-listings",
    "/account/subscriptions",
    "/account/subscriptions/upgrade-plan/add-payment-details",
    "/order-history",
    "/order-history/order-details/:orderId",
    "/order-history/order-received-details/:orderId",
    "/settings",
    "/settings/payment",
    "/settings/addresses/add-addresses",
    "/settings/addresses",
    "/settings/edit-home-adress",
    "/settings/addresses/edit-addresses/:id",
    "/settings/change-password",
    "/settings/deactivate-listing",
    "/settings/support-request",
    "/settings/support-request/email-support",
    "/settings/support-request/live-chat",
    "/settings/privacy-policy",
    "/settings/terms-and-conditions",
    "/settings/delete-account",
    "/terms-and-conditions",
    "/privacy-policy",
    "/optin-flow",
    "/arbitration-agreement",
  ],
};

const RoleProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const currentPath = location.pathname;

  if (!user) {
    <Navigate to="/" replace />;
    return children;
  }

  const allowedPaths = allowedPathsForRoles[user.role];
  const isAllowed = allowedPaths?.some((pattern) =>
    pathMatches(pattern, currentPath)
  );

  if (!isAllowed) {
    return user.role === "influencer" ? (
      <Navigate to="/affiliate" replace />
    ) : (
      <Navigate to="/" replace />
    );
  }

  return children;
};

export default RoleProtectedRoute;
