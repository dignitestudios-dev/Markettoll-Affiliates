// Import Firebase scripts
importScripts(
  "https://www.gstatic.com/firebasejs/9.1.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.1.0/firebase-messaging-compat.js"
);
const firebaseConfig = {
  apiKey: "AIzaSyD8us3uTEnm7u43cqJHTVRCzaSHC2PzKNA",
  authDomain: "markettoll-12722.firebaseapp.com",
  projectId: "markettoll-12722",
  storageBucket: "markettoll-12722.firebasestorage.app",
  messagingSenderId: "415697624629",
  appId: "1:415697624629:web:bdb82c4ee69379c463db7c",
};

firebase.initializeApp(firebaseConfig);

let messaging = firebase.messaging();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      // Ensure Firebase Messaging has the registration before requesting a token
      messaging = firebase.messaging();
      messaging.useServiceWorker(registration);

      // Now request the FCM token
      return messaging.getToken();
    })
    .then((token) => {
      console.log("FCM Token:", token);
    })
    .catch((error) => {
      console.error("Error getting FCM token:", error);
    });
} else {
  console.warn("Service workers are not supported in this browser.");
}

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message: ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
