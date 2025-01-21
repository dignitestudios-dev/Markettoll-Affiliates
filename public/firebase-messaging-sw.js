// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyD8us3uTEnm7u43cqJHTVRCzaSHC2PzKNA",
  authDomain: "markettoll-12722.firebaseapp.com",
  projectId: "markettoll-12722",
  storageBucket: "markettoll-12722.firebasestorage.app",
  messagingSenderId: "415697624629",
  appId: "1:415697624629:web:bdb82c4ee69379c463db7c",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
