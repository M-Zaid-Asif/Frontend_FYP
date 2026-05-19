import React, { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import axiosApi from "../axiosApi";
import toast, { Toaster } from "react-hot-toast";
import ReportItem from "./Report/ReportItem";
import CommentSection from "./Report/CommentSection";

const Reports = () => {
  const [allReports, setAllReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeReportId, setActiveReportId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");

  const fetchUser = useCallback(async () => {
    try {
      const res = await axiosApi.get("/users/getUserProfile");
      setCurrentUser(res.data.data);
    } catch (err) {
      void err;
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    try {
      const res = await axiosApi.get("/users/getAllReports");
      setAllReports(res.data.data || []);
    } catch (err) {
      void err;
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchUser();
      await fetchAllData();
    };
    loadData();
  }, [fetchUser, fetchAllData]);

  const handleVote = async (reportId, value) => {
    const originalReports = [...allReports];
    setAllReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          let newUp = r.upvotesCount || 0;
          let newDown = r.downvotesCount || 0;
          let newUserVote = r.userVote;

          if (newUserVote === value) {
            newUserVote = 0;
            value === 1 ? newUp-- : newDown--;
          } else {
            if (newUserVote === 1) newUp--;
            if (newUserVote === -1) newDown--;
            newUserVote = value;
            value === 1 ? newUp++ : newDown++;
          }
          return {
            ...r,
            upvotesCount: Math.max(0, newUp),
            downvotesCount: Math.max(0, newDown),
            userVote: newUserVote,
          };
        }
        return r;
      }),
    );

    try {
      await axiosApi.post(`/users/v/${reportId}`, { value });
    } catch (err) {
      setAllReports(originalReports);
      toast.error("Vote failed. Please login.");
      void err;
    }
  };

  const filteredReports = allReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.locationName?.toLowerCase().includes(searchTerm.toLowerCase());

    const result = report.validationResult;
    const type = report.type.toUpperCase();

    // Disaster Type Filters
    if (activeFilter === "FLOOD")
      return matchesSearch && type.includes("FLOOD");
    if (activeFilter === "EARTHQUAKE")
      return matchesSearch && type.includes("EARTHQUAKE");

    // Status Filters
    if (activeFilter === "CRITICAL")
      return matchesSearch && result?.confidenceScore >= 80;
    if (activeFilter === "VERIFIED")
      return matchesSearch && result?.decision === "VERIFIED";

    // Needs Review Filter
    if (activeFilter === "NEEDS_REVIEW")
      return matchesSearch && result?.decision === "NEEDS_REVIEW";

    // Pending Filter (Handles reports with no validation result yet)
    if (activeFilter === "PENDING")
      return matchesSearch && (!result || result.decision === "PENDING");

     if (activeFilter === "REJECTED")
      return matchesSearch && (!result || result.decision === "REJECTED");

    return matchesSearch;
  });

  const getTierMeta = (report) => {
    const result = report.validationResult;
    const isFlood = report.type.toUpperCase().includes("FLOOD");

    // Dynamic meta based on decision
    const configs = {
      VERIFIED: {
        label: "Verified",
        color: "text-green-600",
        bg: "bg-green-50",
      },
      REJECTED: { label: "Rejected", color: "text-red-600", bg: "bg-red-50" },
      NEEDS_REVIEW: {
        label: "Needs Review",
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      DEFAULT: { label: "Pending", color: "text-amber-700", bg: "bg-amber-50" },
    };

    const config = configs[result?.decision] || configs.DEFAULT;

    return {
      ...config,
      breakdown: {
        // For Floods, we use weatherMatch.
        // For Earthquakes, we only look at high confidence score since we have no API yet.
        primarySource: isFlood
          ? result?.weatherMatch || false
          : result?.confidenceScore >= 70,
        socialTrust: (result?.confidenceScore || 0) >= 50,
        community: (report.upvotesCount || 0) > (report.downvotesCount || 0),
      },
    };
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <div className="mb-4 relative">
        <Search className="absolute left-4 top-3 text-gray-400" size={18} />
        <input
          className="w-full pl-12 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search reports or locations..."
        />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          "ALL",
          "FLOOD",
          "EARTHQUAKE",
          "CRITICAL",
          "VERIFIED",
          "NEEDS_REVIEW",
          "PENDING",
          "REJECTED",
        ].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1 rounded-full text-sm font-medium transition whitespace-nowrap ${
              activeFilter === f
                ? "bg-blue-600 text-white"
                : "bg-white border text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f.replace("_", " ")}{" "}
            {/* Makes "NEEDS_REVIEW" look like "NEEDS REVIEW" */}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredReports.map((report) => (
          <ReportItem
            key={report.id}
            report={report}
            handleVote={handleVote}
            activeReportId={activeReportId}
            setActiveReportId={setActiveReportId}
            getTierMeta={getTierMeta}
            currentUser={currentUser}
            CommentSection={CommentSection}
          />
        ))}
      </div>
    </div>
  );
};

export default Reports;
