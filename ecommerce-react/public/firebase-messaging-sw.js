// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyA4X0PBeGkHXOLBzU6_HBAc-nDiwXL0oZk",
  authDomain: "ecommerce-chain.firebaseapp.com",
  projectId: "ecommerce-chain",
  storageBucket: "ecommerce-chain.appspot.com",
  messagingSenderId: "176346765194",
  appId: "1:176346765194:web:26c09a64f7d95208eada73",
  measurementId: "G-0B5GLVE64F",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
