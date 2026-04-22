import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "fsdkljndfkljgldfkjgklf",
  authDomain: "rescue-link-f6e45.firebaseapp.com",
  projectId: "rescue-link-f6e45",
  storageBucket: "rescue-link-f6e45.firebasestorage.app",
  messagingSenderId: "791716402207",
  appId: "1:791716402207:web:2c2730de9f1c16053a312a"
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const token = await getToken(messaging, { 
      vapidKey: "fjsdklfjsdklfldsjf" 
    });
    if (token) {
      console.log("Device Token:", token);
      return token;
    }
  } catch (err) {
    console.error("Token generation failed:", err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Foreground payload received:", payload);
      resolve(payload);
    });
  });