import axios from 'axios';
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Our backend URL
  withCredentials: true, // Required for cookies/sessions
});

// Response Interceptor: Listens to every response that comes back from your backend
api.interceptors.response.use(
  (response) => {
    // If the request succeeds, just pass the response through normally
    return response;
  },
  (error) => {
    // Check if the server rejected the request with a 401 Unauthorized status code
    if (error.response && error.response.status === 401) {
      
      // 1. Force clear all stuck toasts (resolves the endless spinning toast issue)
      toast.dismiss(); 
      
      // 2. Alert the user gently without breaking the UI flow
      toast.error("Session expired or unauthorized. Please sign in.");

      // 3. Force redirect the user straight to the login route
      // Using window.location.href ensures a clean redirect even outside a React component
      window.location.href = "/login";
    }

    // Pass the error back down to the component in case it needs to stop a local loader
    return Promise.reject(error);
  }
);

export default api;