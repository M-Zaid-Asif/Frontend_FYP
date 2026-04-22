/* eslint-disable no-undef */
// @ts-nocheck

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
   apiKey: "AIzaSyAfoFUnDtTVTHHw0rs679J4kkRXZ6IJOoY",
  authDomain: "rescue-link-f6e45.firebaseapp.com",
  projectId: "rescue-link-f6e45",
  storageBucket: "rescue-link-f6e45.firebasestorage.app",
  messagingSenderId: "791716402207",
  appId: "1:791716402207:web:2c2730de9f1c16053a312a"
});

const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log('Background Message received: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png' // Path to your app icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});