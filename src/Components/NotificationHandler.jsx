import { useEffect, useRef } from "react";
import { getMessaging, onMessage } from "firebase/messaging";
import { app, requestForToken } from "../firebase";
import axios from "axios";
import { toast } from "react-hot-toast";

const messaging = getMessaging(app);

const NotificationHandler = () => {
  // Use a ref to track if we've already initialized to prevent double-syncing
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;

    const setup = async () => {
      try {
        const token = await requestForToken();
        if (token) {
          await axios.patch(
            "http://localhost:8000/api/v1/users/updatefcmToken",
            { fcmToken: token, deviceType: "web" },
            { withCredentials: true }
          );
          hasInitialized.current = true;
          console.log("FCM Token synced with backend");
        }
      } catch (err) {
        console.error("FCM Setup Error:", err);
      }
    };

    setup();

    // Direct listener inside useEffect
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("New Message Received:", payload.messageId);

      // We use toast.dismiss() first to clear any stuck alerts 
      // or simply allow multiple by using a unique ID
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 border-red-600`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-bold text-gray-900">
                    {payload.notification.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {payload.notification.body}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ),
        {
          duration: 5000,
          position: "top-right",
          id: payload.messageId, // CRITICAL: This allows unique toasts for each message
        }
      );
    });

    return () => unsubscribe();
  }, []);

  return null;
};

export default NotificationHandler;