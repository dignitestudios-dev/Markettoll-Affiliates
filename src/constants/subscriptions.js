export const SUBSCRIPTION_PLANS = [
  {
    title: "Free Plan",
    planType: "Free Plan",
    features: [
      "Post 1 listing per month",
      "No free Boosts available",
      "Includes more ads",
      "Wishlist feature is locked",
    ],
    endpoint: "/users/subscribe-free-plan",
  },
  {
    title: "2.99",
    planType: "Basic Plan",
    duration: "month",
    features: [
      "Post up to 2 listings per month",
      "1 complimentary boosts, valid for 7 days only",
      "Fewer ads than the Free Plan",
      "Wishlist feature is locked",
    ],
    endpoint: "/stripe/subscribe-paid-plan-stripe",
  },
  {
    title: "5.99",
    planType: "Standard Plan",
    duration: "month",
    features: [
      "Post up to 5 listings per month",
      "3 complimentary boosts, valid for 7 days only",
      "Limited advertisements",
      "Wishlist feature is locked",
    ],
    endpoint: "/stripe/subscribe-paid-plan-stripe",
  },
  {
    title: "9.99",
    duration: "month",
    planType: "Premium Plan",
    features: [
      "Unlimited listings",
      "6 complimentary boosts, valid for 7 days only",
      "Completely ad-free experience",
      "Wishlist feature unlocked",
    ],
    endpoint: "/stripe/subscribe-paid-plan-stripe",
  },
];
