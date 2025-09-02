import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "../components/Global/Loader";
import Layout from "../components/Global/Layout";
import RoleProtectedRoute from "./RoleProtectedRoute";

// Lazy imports
const HomePage = lazy(() => import("../pages/home/HomePage"));
const ProductDetailPage = lazy(() =>
  import("../pages/productDetailPage/ProductDetailPage")
);

// Public imports
import TermsAndConditions from "../pages/Policies/TermsAndConditions";
import PrivacyPolicy from "../pages/Policies/PrivacyPolicy";
import ArbitrationAgreement from "../pages/Policies/ArbitrationAgreement";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import UpdatePasswordPage from "../pages/auth/UpdatePasswordPage";
import SuccessScreenPage from "../pages/auth/SuccessScreenPage";
import SignUpPage from "../pages/onboarding/SignUpPage";
import AddPhoneNumberFromSocialLogin from "../components/Auth/AddPhoneNumberFromSocialLogin";
import SearchProductList from "../components/Home/SearchedProductList";
import CategoriesPage from "../pages/categories/CategoriesPage";
import CategoryProducts from "../components/CategoryProducts/CategoryProducts";
import SubCategoriesPage from "../pages/categoryProducts/SubCategoriesPage";

// Protected imports
import ReviewProfilePage from "../pages/onboarding/ReviewProfilePage";
import IdentityVerifiedPage from "../components/Onboarding/IdentityVerifiedPage";
import PackagesPage from "../pages/packages/PackagesPage";
import AddPayment from "../pages/packages/AddPayment";
import OnboardProfileSetupPage from "../pages/onboardProfile/OnboardProfileSetupPage";
import OnBoardingProfileReviewUpdate from "../components/OnboardProfileSetup/OnBoardingProfileReviewUpdate";
import AddLocation from "../pages/onboardProfile/AddLocation";
import WouldAddService from "../components/OnboardProfileSetup/WouldAddService";
import AddProductPage from "../pages/addProduct/AddProductPage";
import ProductReviewPage from "../pages/addProduct/ProductReviewPage";
import EditProductPage from "../pages/addProduct/EditProductPage";
import WouldYouBoostProduct from "../components/BoostPost/WouldYouBoostProduct";
import AddServicePage from "../pages/addService/AddServicePage";
import ServiceReviewPage from "../pages/addService/ServiceReviewPage";
import EditServicePage from "../pages/addService/EditServicePage";
import BoostServicePage from "../pages/addService/BoostServicePage";
import ServiceBoostPackagesPage from "../pages/addService/ServiceBoostPackagesPage";
import BoostPostPage from "../pages/boostPost/BoostPostPage";
import ServiceDetailsPage from "../pages/addService/ServiceDetailsPage";
import SellerProfilePage from "../pages/sellerProfile/SellerProfilePage";
import CartPage from "../pages/cart/CartPage";
import ReviewOrderDetails from "../components/Cart/ReviewOrderDetails";
import ChatPage from "../pages/chat/ChatPage";
import FavouriteItemsPage from "../pages/favouriteItems/FavouriteItemsPage";
import PersonalInfoPage from "../pages/profile/PersonalInfoPage";
import MyListingPage from "../pages/profile/MyListingPage";
import MyWalletPage from "../pages/profile/MyWalletPage";
import SubscriptionsPage from "../pages/profile/SubscriptionsPage";
import AddPaymentDetailsPage from "../pages/profile/AddPaymentDetailsPage";
import OrderHistoryPage from "../pages/profile/OrderHistoryPage";
import OrderDetailsPage from "../pages/profile/OrderDetailsPage";
import OrderReceivedDetails from "../components/profile/OrderRecievedDetails";
import SettingsPage from "../pages/settings/SettingsPage";
import NotificationsPage from "../pages/settings/NotificationsPage";
import SettingsPayementPage from "../pages/settings/SettingsPayementPage";
import SettingsAddressPage from "../pages/settings/SettingsAddressPage";
import SettingsAddAddressPage from "../pages/settings/SettingsAddAddressPage";
import SettingsAddressEditPage from "../pages/settings/SettingsAddressEditPage";
import SettingsEditHomeAddress from "../pages/settings/SettingsEditHomeAddress";
import SettingsChangePasswordPage from "../pages/settings/SettingsChangePasswordPage";
import SettingsDeactivateListingPage from "../pages/settings/SettingsDeactivateListingPage";
import SupportRequestPage from "../pages/settings/SupportRequestPage";
import EmailSupportPage from "../pages/settings/EmailSupportPage";
import LiveChatPage from "../pages/settings/LiveChatPage";
import SettingsDeleteAccountPage from "../pages/settings/SettingsDeleteAccountPage";
import Affiliate from "../pages/affiliate/Affiliate";

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout page={<HomePage />} />} />
        <Route path="/login" element={<Layout page={<LoginPage />} />} />
        <Route path="/sign-up" element={<Layout page={<SignUpPage />} />} />
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
        <Route
          path="/add-phone-number"
          element={<Layout page={<AddPhoneNumberFromSocialLogin />} />}
        />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route
          path="/arbitration-agreement"
          element={<ArbitrationAgreement />}
        />
        <Route
          path="/search-product"
          element={<Layout page={<SearchProductList />} />}
        />
        <Route
          path="/home/categories"
          element={<Layout page={<CategoriesPage />} />}
        />
        <Route
          path="/home/categories/:category"
          element={<Layout page={<CategoryProducts />} />}
        />
        <Route
          path="/categories/:category/:subCategory"
          element={<Layout page={<SubCategoriesPage />} />}
        />
        <Route
          path="/products/:productId"
          element={<Layout page={<ProductDetailPage />} />}
        />

        {/* Protected Routes */}
        <Route
          path="/affiliate"
          element={
            <RoleProtectedRoute>
              <Layout page={<Affiliate />} />
            </RoleProtectedRoute>
          }
        />
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
          element={
            <RoleProtectedRoute>
              <Layout page={<OnboardProfileSetupPage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/review-profile-image"
          element={
            <RoleProtectedRoute>
              <Layout page={<OnBoardingProfileReviewUpdate />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/add-location"
          element={
            <RoleProtectedRoute>
              <Layout page={<AddLocation />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/add-service-or-product"
          element={
            <RoleProtectedRoute>
              <Layout page={<WouldAddService />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/add-product"
          element={
            <RoleProtectedRoute>
              <Layout page={<AddProductPage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/edit-product/:productId"
          element={
            <RoleProtectedRoute>
              <Layout page={<EditProductPage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/product-review"
          element={
            <RoleProtectedRoute>
              <Layout page={<ProductReviewPage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/would-you-boost-your-product"
          element={
            <RoleProtectedRoute>
              <Layout page={<WouldYouBoostProduct />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/add-service"
          element={
            <RoleProtectedRoute>
              <Layout page={<AddServicePage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/service-review"
          element={
            <RoleProtectedRoute>
              <Layout page={<ServiceReviewPage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/services/edit-service/:serviceId"
          element={
            <RoleProtectedRoute>
              <Layout page={<EditServicePage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/boost-service"
          element={
            <RoleProtectedRoute>
              <Layout page={<BoostServicePage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/choose-package-to-boost-service"
          element={
            <RoleProtectedRoute>
              <Layout page={<ServiceBoostPackagesPage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/boost-post"
          element={
            <RoleProtectedRoute>
              <Layout page={<BoostPostPage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/services/:serviceId"
          element={
            <RoleProtectedRoute>
              <Layout page={<ServiceDetailsPage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/seller-profile/:sellerId"
          element={
            <RoleProtectedRoute>
              <Layout page={<SellerProfilePage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <RoleProtectedRoute>
              <Layout page={<CartPage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/order-details/:orderId"
          element={
            <RoleProtectedRoute>
              <Layout page={<ReviewOrderDetails />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/chats"
          element={
            <RoleProtectedRoute>
              <Layout page={<ChatPage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/favourites"
          element={
            <RoleProtectedRoute>
              <Layout page={<FavouriteItemsPage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/account/peronal-info"
          element={
            <RoleProtectedRoute>
              <Layout page={<PersonalInfoPage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/account/my-wallet"
          element={
            <RoleProtectedRoute>
              <Layout page={<MyWalletPage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/account/my-listings"
          element={
            <RoleProtectedRoute>
              <Layout page={<MyListingPage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/account/subscriptions"
          element={
            <RoleProtectedRoute>
              <Layout page={<SubscriptionsPage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/account/subscriptions/upgrade-plan/add-payment-details"
          element={
            <RoleProtectedRoute>
              <Layout page={<AddPaymentDetailsPage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/order-history"
          element={
            <RoleProtectedRoute>
              <Layout page={<OrderHistoryPage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/order-history/order-details/:orderId"
          element={
            <RoleProtectedRoute>
              <Layout page={<OrderDetailsPage />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/order-history/order-received-details/:orderId"
          element={
            <RoleProtectedRoute>
              <Layout page={<OrderReceivedDetails />} />
            </RoleProtectedRoute>
          }
        />
        {/* Settings Protected Routes */}
        <Route
          path="/settings"
          element={
            <RoleProtectedRoute>
              <Layout page={<SettingsPage page={<NotificationsPage />} />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/settings/payment"
          element={
            <RoleProtectedRoute>
              <Layout page={<SettingsPage page={<SettingsPayementPage />} />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/settings/addresses"
          element={
            <RoleProtectedRoute>
              <Layout page={<SettingsPage page={<SettingsAddressPage />} />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/settings/addresses/add-addresses"
          element={
            <RoleProtectedRoute>
              <Layout
                page={<SettingsPage page={<SettingsAddAddressPage />} />}
              />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/settings/edit-home-adress"
          element={
            <RoleProtectedRoute>
              <Layout
                page={<SettingsPage page={<SettingsEditHomeAddress />} />}
              />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/settings/addresses/edit-addresses/:id"
          element={
            <RoleProtectedRoute>
              <Layout
                page={<SettingsPage page={<SettingsAddressEditPage />} />}
              />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/settings/change-password"
          element={
            <RoleProtectedRoute>
              <Layout
                page={<SettingsPage page={<SettingsChangePasswordPage />} />}
              />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/settings/deactivate-listing"
          element={
            <RoleProtectedRoute>
              <Layout
                page={<SettingsPage page={<SettingsDeactivateListingPage />} />}
              />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/settings/support-request"
          element={
            <RoleProtectedRoute>
              <Layout page={<SettingsPage page={<SupportRequestPage />} />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/settings/support-request/email-support"
          element={
            <RoleProtectedRoute>
              <Layout page={<SettingsPage page={<EmailSupportPage />} />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/settings/support-request/live-chat"
          element={
            <RoleProtectedRoute>
              <Layout page={<SettingsPage page={<LiveChatPage />} />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/settings/privacy-policy"
          element={
            <RoleProtectedRoute>
              <Layout page={<SettingsPage page={<PrivacyPolicy />} />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/settings/terms-and-conditions"
          element={
            <RoleProtectedRoute>
              <Layout page={<SettingsPage page={<TermsAndConditions />} />} />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/settings/delete-account"
          element={
            <RoleProtectedRoute>
              <Layout
                page={<SettingsPage page={<SettingsDeleteAccountPage />} />}
              />
            </RoleProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
