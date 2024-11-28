import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
const HomePage = lazy(() => import("../pages/home/HomePage"));
const ProductDetailPage = lazy(() =>
  import("../pages/productDetailPage/ProductDetailPage")
);
import TermsAndConditions from "../pages/Policies/TermsAndConditions";
import PrivacyPolicy from "../pages/Policies/PrivacyPolicy";
import SignUpPage from "../pages/onboarding/SignUpPage";
import Layout from "../components/Global/Layout";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import UpdatePasswordPage from "../pages/auth/UpdatePasswordPage";
import SuccessScreenPage from "../pages/auth/SuccessScreenPage";
import ReviewProfilePage from "../pages/onboarding/ReviewProfilePage";
import PackagesPage from "../pages/packages/PackagesPage";
import OnboardProfileSetupPage from "../pages/onboardProfile/OnboardProfileSetupPage";
import WouldAddService from "../components/OnboardProfileSetup/WouldAddService";
import AddProductPage from "../pages/addProduct/AddProductPage";
import ProductReviewPage from "../pages/addProduct/ProductReviewPage";
import AddServicePage from "../pages/addService/AddServicePage";
import ServiceReviewPage from "../pages/addService/ServiceReviewPage";
import BoostServicePage from "../pages/addService/BoostServicePage";
import ServiceBoostPackagesPage from "../pages/addService/ServiceBoostPackagesPage";
import BoostPostPage from "../pages/boostPost/BoostPostPage";
import CategoriesPage from "../pages/categories/CategoriesPage";
import CategoryProductsPage from "../pages/categoryProducts/CategoryProductsPage";
import SellerProfilePage from "../pages/sellerProfile/SellerProfilePage";
import CartPage from "../pages/cart/CartPage";
import ChatPage from "../pages/chat/ChatPage";
import FavouriteItemsPage from "../pages/favouriteItems/FavouriteItemsPage";
import PersonalInfoPage from "../pages/profile/PersonalInfoPage";
import MyListingPage from "../pages/profile/MyListingPage";
import MyWalletPage from "../pages/profile/MyWalletPage";
import SubscriptionsPage from "../pages/profile/SubscriptionsPage";
import AddPaymentDetailsPage from "../pages/profile/AddPaymentDetailsPage";
import OrderHistoryPage from "../pages/profile/OrderHistoryPage";
import OrderDetailsPage from "../pages/profile/OrderDetailsPage";
import SettingsPage from "../pages/settings/SettingsPage";
import NotificationsPage from "../pages/settings/NotificationsPage";
import SettingsPayementPage from "../pages/settings/SettingsPayementPage";
import SettingsAddressPage from "../pages/settings/SettingsAddressPage";
import SettingsAddAddressPage from "../pages/settings/SettingsAddAddressPage";
import SettingsAddressEditPage from "../pages/settings/SettingsAddressEditPage";
import SettingsChangePasswordPage from "../pages/settings/SettingsChangePasswordPage";
import SettingsDeactivateListingPage from "../pages/settings/SettingsDeactivateListingPage";
import SupportRequestPage from "../pages/settings/SupportRequestPage";
import EmailSupportPage from "../pages/settings/EmailSupportPage";
import LiveChatPage from "../pages/settings/LiveChatPage";
import SettingsDeleteAccountPage from "../pages/settings/SettingsDeleteAccountPage";
import AddPaymentPage from "../pages/packages/AddPaymentPage";
import ServiceDetailsPage from "../pages/addService/ServiceDetailsPage";
import StripeProvider from "../components/Global/StripeProvider";
import AddPayment from "../pages/packages/AddPayment";
import IdentityVerifiedPage from "../components/Onboarding/IdentityVerifiedPage";
import SettingsEditHomeAddress from "../pages/settings/SettingsEditHomeAddress";
import Loader from "../components/Global/Loader";

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Layout page={<HomePage />} />} />

        <Route path="/login" element={<Layout page={<LoginPage />} />} />
        <Route
          path="/forgot-password"
          element={<Layout page={<ForgotPasswordPage />} />}
        />
        <Route
          path="/verify-otp"
          element={<Layout page={<VerifyOtpPage />} />}
        />
        <Route
          path="/update-password"
          element={<Layout page={<UpdatePasswordPage />} />}
        />
        <Route
          path="/password-updated"
          element={<Layout page={<SuccessScreenPage />} />}
        />

        <Route path="/sign-up" element={<Layout page={<SignUpPage />} />} />
        <Route
          path="/review-profile"
          element={<Layout page={<ReviewProfilePage />} />}
        />
        <Route
          path="/identity-verified"
          element={<Layout page={<IdentityVerifiedPage />} />}
        />

        <Route
          path="/subscriptions"
          element={<Layout page={<PackagesPage />} />}
        />
        <Route
          path="/subscriptions/add-payment-details"
          element={<Layout page={<AddPayment />} />}
        />

        <Route
          path="/profile-setup"
          element={<Layout page={<OnboardProfileSetupPage />} />}
        />

        <Route
          path="/add-service-or-product"
          element={<Layout page={<WouldAddService />} />}
        />

        <Route
          path="/add-product"
          element={<Layout page={<AddProductPage />} />}
        />

        <Route
          path="/product-review"
          element={<Layout page={<ProductReviewPage />} />}
        />

        <Route
          path="/add-service"
          element={<Layout page={<AddServicePage />} />}
        />

        <Route
          path="/service-review"
          element={<Layout page={<ServiceReviewPage />} />}
        />

        <Route
          path="/boost-service"
          element={<Layout page={<BoostServicePage />} />}
        />

        <Route
          path="/choose-package-to-boost-service"
          element={<Layout page={<ServiceBoostPackagesPage />} />}
        />

        <Route
          path="/boost-post"
          element={<Layout page={<BoostPostPage />} />}
        />

        <Route
          path="/categories"
          element={<Layout page={<CategoriesPage />} />}
        />

        <Route
          path="/categories/:category"
          element={<Layout page={<CategoryProductsPage />} />}
        />

        <Route
          path="/products/:productId"
          element={<Layout page={<ProductDetailPage />} />}
        />
        <Route
          path="/services/:serviceId"
          element={<Layout page={<ServiceDetailsPage />} />}
        />

        <Route
          path="/seller-profile/:sellerId"
          element={<Layout page={<SellerProfilePage />} />}
        />

        <Route path="/cart" element={<Layout page={<CartPage />} />} />

        {/* chat routes */}
        <Route path="/chats" element={<Layout page={<ChatPage />} />} />

        <Route
          path="/favourites"
          element={<Layout page={<FavouriteItemsPage />} />}
        />

        {/* profile routes */}
        <Route
          path="/account/peronal-info"
          element={<Layout page={<PersonalInfoPage />} />}
        />
        <Route
          path="/account/my-listings"
          element={<Layout page={<MyListingPage />} />}
        />
        <Route
          path="/account/my-wallet"
          element={<Layout page={<MyWalletPage />} />}
        />
        <Route
          path="/account/subscriptions"
          element={<Layout page={<SubscriptionsPage />} />}
        />
        <Route
          path="/account/subscriptions/upgrade-plan/add-payment-details"
          element={<Layout page={<AddPaymentDetailsPage />} />}
        />
        <Route
          path="/order-history"
          element={<Layout page={<OrderHistoryPage />} />}
        />
        <Route
          path="/order-history/order-details/:orderId"
          element={<Layout page={<OrderDetailsPage />} />}
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <Layout page={<SettingsPage page={<NotificationsPage />} />} />
          }
        />
        <Route
          path="/settings/payment"
          element={
            <Layout page={<SettingsPage page={<SettingsPayementPage />} />} />
          }
        />
        <Route
          path="/settings/addresses"
          element={
            <Layout page={<SettingsPage page={<SettingsAddressPage />} />} />
          }
        />
        <Route
          path="/settings/edit-home-adress"
          element={
            <Layout
              page={<SettingsPage page={<SettingsEditHomeAddress />} />}
            />
          }
        />
        <Route
          path="/settings/addresses/add-addresses"
          element={
            <Layout page={<SettingsPage page={<SettingsAddAddressPage />} />} />
          }
        />
        <Route
          path="/settings/addresses/edit-addresses"
          element={
            <Layout
              page={<SettingsPage page={<SettingsAddressEditPage />} />}
            />
          }
        />
        <Route
          path="/settings/change-password"
          element={
            <Layout
              page={<SettingsPage page={<SettingsChangePasswordPage />} />}
            />
          }
        />
        <Route
          path="/settings/deactivate-listing"
          element={
            <Layout
              page={<SettingsPage page={<SettingsDeactivateListingPage />} />}
            />
          }
        />
        <Route
          path="/settings/support-request"
          element={
            <Layout page={<SettingsPage page={<SupportRequestPage />} />} />
          }
        />
        <Route
          path="/settings/support-request/email-support"
          element={
            <Layout page={<SettingsPage page={<EmailSupportPage />} />} />
          }
        />
        <Route
          path="/settings/support-request/live-chat"
          element={<Layout page={<SettingsPage page={<LiveChatPage />} />} />}
        />
        <Route
          path="/settings/privacy-policy"
          element={<Layout page={<SettingsPage page={<PrivacyPolicy />} />} />}
        />
        <Route
          path="/settings/terms-and-conditions"
          element={
            <Layout page={<SettingsPage page={<TermsAndConditions />} />} />
          }
        />
        <Route
          path="/settings/delete-account"
          element={
            <Layout
              page={<SettingsPage page={<SettingsDeleteAccountPage />} />}
            />
          }
        />

        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
