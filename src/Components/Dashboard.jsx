import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosApi from "../axiosApi";

import NGOView from "./Dashboard/NGOView";
import CitizenView from "./Dashboard/CitizenView";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [resources, setResources] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userRes = await axiosApi.get("/users/getUserProfile");
        const userData = userRes.data.data;
        setUser(userData);

        const reportRoute =
          userData.role === "NGO"
            ? "/users/getAllReports"
            : "/users/getReports";

        const reportRes = await axiosApi.get(reportRoute);
        setReports(reportRes.data.data);

        if (userData.role === "NGO") {
          const resourceRes = await axiosApi.get("/users/getResources");
          setResources(resourceRes.data.data);
        }
      } catch (error) {
        toast.error("Failed to sync dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (user?.role === "NGO") {
    return (
      <NGOView
        user={user}
        reports={reports}
        resources={resources}
        navigate={navigate}
        handleDeleteReport={handleDeleteReport}
      />
    );
  }

  if (user?.role === "CITIZEN") {
    return (
      <CitizenView
        reports={reports}
        showAll={showAll}
        setShowAll={setShowAll}
        navigate={navigate}
        handleDeleteReport={handleDeleteReport}
      />
    );
  }
};

export default Dashboard;