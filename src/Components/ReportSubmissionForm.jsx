import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { MapPin, AlertTriangle, Send } from "lucide-react";
import axiosApi from "../axiosApi";

const ReportSubmitForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "FLOOD", // Matches your DisasterType Enum
    latitude: "",
    longitude: "",
    locationName: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper to get coordinates from the browser
  const getLocation = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation is not supported by your browser");
    }

    toast.loading("Fetching your coordinates...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        toast.dismiss();
        toast.success("Location captured!");
      },
      () => {
        toast.dismiss();
        toast.error("Unable to retrieve location. Please enter manually.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    toast.promise(
      axiosApi.post("/users/createReport", formData), // Replace with your actual route
      {
        loading: "Submitting your report...",
        success: () => {
          setTimeout(() => navigate("/dashboard"), 2000);
          return <b>Report submitted successfully!</b>;
        },
        error: (err) => {
          setLoading(false);
          return <b>{err.response?.data?.message || "Submission failed"}</b>;
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <AlertTriangle className="mx-auto h-12 w-12 mb-2" />
          <h2 className="text-3xl font-extrabold">Report a Disaster</h2>
          <p className="mt-2 text-indigo-100">Provide accurate details to help emergency services.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Report Title</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g., Severe flooding on Main St"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Disaster Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Disaster Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              >
                <option value="FLOOD">Flood</option>
                <option value="EARTHQUAKE">Earthquake</option>
              </select>
            </div>

            {/* Location Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Location Name</label>
              <input
                type="text"
                name="locationName"
                placeholder="City or Area Name"
                value={formData.locationName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              name="description"
              rows="4"
              required
              placeholder="Describe the situation in detail..."
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            ></textarea>
          </div>

          {/* Coordinates Section */}
          <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin size={18} className="text-indigo-600" /> GPS Coordinates
              </span>
              <button
                type="button"
                onClick={getLocation}
                className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md hover:bg-indigo-200 font-bold transition"
              >
                Auto-detect Location
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="n"
                step="any"
                name="latitude"
                required
                placeholder="Latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-lg p-2 text-sm"
              />
              <input
                type="float"
                step="any"
                name="longitude"
                required
                placeholder="Longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : <><Send size={20} /> Submit Report</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportSubmitForm;