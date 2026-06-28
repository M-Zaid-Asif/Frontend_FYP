import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import axiosApi from "../axiosApi.js";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Matching UI Toast
    toast.promise(axiosApi.post("/users/forgot-password", { email }), {
      loading: "Verifying account registration...",
      success: (res) => {
        return <b>{res.data.message || "Reset link dispatched successfully!"}</b>;
      },
      error: (err) => {
        return (
          <b>{err.response?.data?.message || "Failed to process request. Try again."}</b>
        );
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <Toaster position="top-center" reverseOrder={false} />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative">
        <button 
          onClick={() => navigate(-1)}
          className="absolute -top-6 left-2 sm:left-0 text-gray-500 hover:text-gray-900 transition flex items-center gap-1 text-xs font-semibold"
        >
          <ArrowLeft size={14} /> Back to Sign In
        </button>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Account Recovery
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Remembered it?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                Enter your registered email address. If the account exists, we will dispatch a secure 15-minute verification recovery link.
              </p>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;