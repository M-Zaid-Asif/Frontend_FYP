import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FileText,
  Users,
  Thermometer,
  Cloud,
  Wind,
  PlusCircle,
  Edit2,
  Trash2,
  Clock,
  FileWarning,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Map as MapIcon,
  AlertCircle,
  TrendingUp,
  ExternalLink,
  Package,
  Home,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axiosApi from "../axiosApi";
import Weather from "./Weather";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [reports, setReports] = useState([]); // User's own reports or communal feed
  const [resources, setResources] = useState([]); // Real inventory items
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch current user to determine role
        const userRes = await axiosApi.get("/users/getUserProfile");
        const userData = userRes.data.data;
        setUser(userData);

        // 2. Fetch Reports based on role
        const reportRoute =
          userData.role === "NGO"
            ? "/users/getAllReports"
            : "/users/getReports";
        const reportRes = await axiosApi.get(reportRoute);
        setReports(reportRes.data.data);

        // 3. If NGO, fetch their specific inventory
        if (userData.role === "NGO") {
          const resourceRes = await axiosApi.get("/users/getResources");
          setResources(resourceRes.data.data);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        toast.error("Failed to sync dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // --- LOGIC: AGGREGATE RESOURCES BY CATEGORY ---
  const resourceTotals = resources.reduce((acc, item) => {
    const cat = item.category.toUpperCase();
    acc[cat] = (acc[cat] || 0) + item.quantity;
    return acc;
  }, {});

  const getResourceMeta = (category) => {
    const meta = {
      FOOD: {
        icon: <Package className="text-orange-600" />,
        bg: "bg-orange-50",
        label: "Food Rations",
      },
      MEDICAL: {
        icon: <ShieldCheck className="text-red-600" />,
        bg: "bg-red-50",
        label: "Medical Kits",
      },
      SHELTER: {
        icon: <Home className="text-blue-600" />,
        bg: "bg-blue-50",
        label: "Shelter Units",
      },
      TRANSPORT: {
        icon: <Wind className="text-indigo-600" />,
        bg: "bg-indigo-50",
        label: "Vehicles",
      },
      TOOLS: {
        icon: <PlusCircle className="text-green-600" />,
        bg: "bg-green-50",
        label: "Rescue Tools",
      },
    };
    return (
      meta[category] || { icon: <Package />, bg: "bg-gray-50", label: category }
    );
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await axiosApi.delete(`/users/deleteReport/${id}`);
      setReports((prev) => prev.filter((r) => r.id !== id));
      toast.success("Report deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const displayedReports = showAll ? reports : reports.slice(0, 3);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  // --- NGO VIEW ---
  if (user?.role === "NGO") {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <Toaster position="top-right" />
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                NGO Response Command
              </h1>
              <p className="text-gray-500">
                Managing disaster response for {user.name}.
              </p>
            </div>
          </header>

          <Weather />

          {/* 1. ACTUAL RESOURCE INVENTORY */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <ShieldCheck size={20} className="text-indigo-600" /> Current
              Warehouse Stock
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.keys(resourceTotals).length > 0 ? (
                Object.keys(resourceTotals).map((cat) => {
                  const { icon, bg, label } = getResourceMeta(cat);
                  return (
                    <div
                      key={cat}
                      className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
                    >
                      <div className={`${bg} p-3 rounded-xl`}>{icon}</div>
                      <div>
                        <p className="text-2xl font-black text-gray-900">
                          {resourceTotals[cat]}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {label}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full p-8 border-2 border-dashed rounded-2xl text-center bg-white border-gray-200">
                  <p className="text-gray-400">
                    No resources found in inventory.
                  </p>
                  <Link
                    to="/updateInventory"
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Add Items Now
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* 2. NGO NAVIGATION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => navigate("/submitReport")}
              className="cursor-pointer bg-red-600 rounded-2xl p-6 text-white shadow-lg hover:-translate-y-1 transition-all"
            >
              <PlusCircle size={32} className="mb-4 opacity-80" />
              <h2 className="text-xl font-bold">File Field Report</h2>
              <p className="text-red-100 text-xs mb-4">
                Report new disaster sighting.
              </p>
              <span className="text-xs font-bold bg-white text-red-600 px-3 py-1 rounded-full uppercase tracking-tighter">
                New Report
              </span>
            </div>
            <div
              onClick={() => navigate("/updateInventory")}
              className="cursor-pointer bg-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:-translate-y-1 transition-all"
            >
              <ShieldCheck size={32} className="mb-4 opacity-80" />
              <h2 className="text-xl font-bold">Manage Inventory</h2>
              <p className="text-indigo-100 text-xs mb-4">
                Add/Edit food or medical stock.
              </p>
              <span className="text-xs font-bold bg-white text-indigo-600 px-3 py-1 rounded-full uppercase tracking-tighter">
                Update Stock
              </span>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <MapIcon size={32} className="mb-4 text-gray-400" />
              <h2 className="text-xl font-bold text-gray-900">Crisis Map</h2>
              <p className="text-gray-500 text-xs mb-4">
                View active disaster geo-tags.
              </p>
              <button className="text-xs font-bold bg-gray-100 text-gray-900 px-3 py-1 rounded-full uppercase tracking-tighter">
                Launch Map
              </button>
            </div>
          </div>

          {/* 3. COMMUNAL FEED */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Live Communal Feed
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
              {reports.slice(0, 5).map((report) => (
                <div
                  key={report.id}
                  className="p-5 flex justify-between items-center"
                >
                  <div>
                    <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase">
                      {report.type}
                    </span>
                    <h3 className="font-bold text-gray-900">{report.title}</h3>
                    <p className="text-xs text-gray-400">
                      {report.locationName}
                    </p>
                  </div>
                  <button className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:underline">
                    Respond <ExternalLink size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- CITIZEN VIEW ---
  if (user?.role === "CITIZEN") {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <Toaster position="top-right" />
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Weather Banner */}
         <Weather />

          {/* Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => navigate("/submitReport")}
              className="group cursor-pointer bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <PlusCircle className="text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900">Submit Report</h3>
              <p className="text-gray-500 text-sm mt-1">
                Report a disaster or civic complaint.
              </p>
            </div>
            <div
              onClick={() => navigate("/reports")}
              className="group cursor-pointer bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <FileWarning className="text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900">Local Feed</h3>
              <p className="text-gray-500 text-sm mt-1">
                See alerts from other citizens.
              </p>
            </div>
            <div
              onClick={() => navigate("/chatbot")}
              className="group cursor-pointer bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <Users className="text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900">Chatbot</h3>
              <p className="text-gray-500 text-sm mt-1">
               Use chatbot to gain insight about precautionary measures.
              </p>
            </div>
          </div>

          {/* User Activity */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Your Activity
              </h2>
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-indigo-600 font-bold text-sm"
              >
                {showAll ? "Show Less" : "View All"}
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
              {displayedReports.length > 0 ? (
                displayedReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-5 flex justify-between items-center hover:bg-gray-50 transition"
                  >
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {report.title}
                      </h3>
                      <p className="text-xs text-gray-400 italic">
                        {report.locationName}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/updateReport/${report.id}`)}
                        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-gray-400">
                  No reports found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Dashboard;
