import firebase from "firebase/app";
import "firebase/messaging";

const config = {
  apiKey: "AIzaSyA4X0PBeGkHXOLBzU6_HBAc-nDiwXL0oZk",
  authDomain: "ecommerce-chain.firebaseapp.com",
  projectId: "ecommerce-chain",
  storageBucket: "ecommerce-chain.appspot.com",
  messagingSenderId: "176346765194",
  appId: "1:176346765194:web:26c09a64f7d95208eada73",
  measurementId: "G-0B5GLVE64F",
};

firebase.initializeApp(config);
const messaging = firebase.messaging();

export const getToken = (setTokenFound) => {
  return messaging
    .getToken({
      vapidKey:
        "BMwtnozVVUHcuPvfsx6WmsSW78jQKlRfUnwQIy3SymN9HzAxupkGGrzZRDHhRD2SgBL6mhYWIqeRKnfvTtgF-pM",
    })
    .then((currentToken) => {
      if (currentToken) {
        console.log("current token for client: ", currentToken);
        localStorage.setItem('firebasetoken',currentToken);
        setTokenFound(true);
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
        setTokenFound(false);
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // catch error while creating client token
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });
