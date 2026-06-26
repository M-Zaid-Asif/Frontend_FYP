/* eslint-disable no-undef */
// @ts-nocheck


// Importing necessary packages and libraries so firebase can work perfectly in the application.
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Configuring Firebase settings, same as firebase.js (src)
firebase.initializeApp({
   apiKey: "AIzaSyAfoFUnDtTVTHHw0rs679J4kkRXZ6IJOoY",
  authDomain: "rescue-link-f6e45.firebaseapp.com",
  projectId: "rescue-link-f6e45",
  storageBucket: "rescue-link-f6e45.firebasestorage.app",
  messagingSenderId: "791716402207",
  appId: "1:791716402207:web:2c2730de9f1c16053a312a"
});

const messaging = firebase.messaging();

// Handle background notifications, when app is not in used and then display the alert in device native UI.
messaging.onBackgroundMessage((payload) => {
  console.log('Background Message received: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png' // Path to app icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});