import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit3, MapPin, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axiosApi from "../axiosApi";

const UpdateReportForm = () => {
  const { reportId } = useParams(); // Gets ID from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    locationName: "",
    latitude: "",
    longitude: "",
  });

  // 1. Fetch the existing report data
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axiosApi.get(`/users/getReports`); 
        // Note: You can also create a getReportById backend route for better performance
        const report = response.data.data.find(r => r.id === reportId);
        
        if (report) {
          setFormData({
            title: report.title,
            description: report.description,
            type: report.type,
            locationName: report.locationName,
            latitude: report.latitude,
            longitude: report.longitude,
          });
        }
      } catch (error) {
        toast.error("Failed to load report data");
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, [reportId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Submit the PATCH request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    toast.promise(
      axiosApi.patch(`/users/updateReport/${reportId}`, formData),
      {
        loading: "Updating report...",
        success: () => {
          setTimeout(() => navigate("/dashboard"), 1500);
          return <b>Report updated successfully!</b>;
        },
        error: (err) => {
          setUpdating(false);
          return <b>{err.response?.data?.message || "Update failed"}</b>;
        },
      }
    );
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Toaster position="top-center" />
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <Edit3 className="mx-auto h-10 w-10 mb-2" />
          <h2 className="text-2xl font-bold">Update Disaster Report</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Disaster Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3"
            >
              <option value="FLOOD">Flood</option>
              <option value="EARTHQUAKE">Earthquake</option>
              <option value="FIRE">Fire</option>
              <option value="STORM">Storm</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-3"
              required
            ></textarea>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
             <p className="text-sm font-medium mb-2 flex items-center gap-2"><MapPin size={16}/> Location Details</p>
             <input
                type="text"
                name="locationName"
                placeholder="Location Name"
                value={formData.locationName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 mb-3"
             />
             <div className="grid grid-cols-2 gap-4">
                <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Lat" className="border p-2 rounded" />
                <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Long" className="border p-2 rounded" />
             </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"
          >
            {updating ? "Saving Changes..." : "Update Report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateReportForm;