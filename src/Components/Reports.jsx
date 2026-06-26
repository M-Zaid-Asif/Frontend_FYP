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
    
    // 1. Optimistic local state update to keep the click feeling snappy
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

          // Local estimation prediction of the new score configuration
          // This keeps UI metrics consistent during the short API loading phase
          const hasWeather = r.validationResult?.weatherMatch || false;
          const hasSocial = r.validationResult?.newsMatch || false;
          const totalVotes = newUp + newDown;
          
          let predictedScore = 0;
          if (r.type.toUpperCase() === "FLOOD") {
            if (hasWeather) predictedScore += 50;
            if (hasSocial) predictedScore += 25;
            if (totalVotes >= 1) predictedScore += 25;
          }

          return {
            ...r,
            upvotesCount: Math.max(0, newUp),
            downvotesCount: Math.max(0, newDown),
            userVote: newUserVote,
            // Temporarily patch the local decision object to prevent visual checkmark flicker
            validationResult: {
              ...r.validationResult,
              confidenceScore: predictedScore,
              decision: predictedScore >= 75 ? "VERIFIED" : predictedScore < 30 ? "REJECTED" : "NEEDS_REVIEW"
            }
          };
        }
        return r;
      }),
    );

    // 2. Synchronize with the backend rules engine database
    try {
      await axiosApi.post(`/users/v/${reportId}`, { value });
      
      // FORCE RE-FETCH: Pulls the absolute ground-truth data values, scores, 
      // and matching flags computed straight by your Prisma backend validation script
      await fetchAllData(); 
      
    } catch (err) {
      // Revert back safely if network error occurs or user is unauthenticated
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

    // Rejected Filter Fix
    if (activeFilter === "REJECTED")
      return matchesSearch && result?.decision === "REJECTED";

    return matchesSearch;
  });

  // --- UPDATED FRONTEND META SYNC ---
  const getTierMeta = (report) => {
    const result = report.validationResult;
    const score = result?.confidenceScore || 0;

    // 1. Read the clean, decoupled flags straight from your database model fields
    const isWeatherMatched = result?.weatherMatch || false;
    const isSocialMatched = result?.newsMatch || false; // Maps straight to your database socialMatch write column

    const isFlood = report.type.toUpperCase().includes("FLOOD");
    const totalVotes =
      (report.upvotesCount || 0) + (report.downvotesCount || 0);

    const configs = {
      VERIFIED: {
        label: "Verified",
        color: "text-green-600",
        bg: "bg-green-50",
      },
      REJECTED: {
        label: "Rejected",
        color: "text-red-600",
        bg: "bg-red-50",
      },
      NEEDS_REVIEW: {
        label: "Needs Review",
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      DEFAULT: {
        label: "Pending",
        color: "text-amber-700",
        bg: "bg-amber-50",
      },
    };

    const config = configs[result?.decision] || configs.DEFAULT;

    return {
      ...config,
      // 2. Map the UI checkmarks (true) and crosses (false) to match database truth
      breakdown: {
        // Weather Row: True only if the database confirms rainfall was verified
        primarySource: isFlood ? isWeatherMatched : score >= 70,

        // Community Trust Row: True if a citizen submitted a vote and score is healthy
        community: totalVotes >= 1,

        // Social Proof Row: True directly if nearby records were found during backend evaluation
        socialProof: isFlood ? isSocialMatched : false,
      },
    };
  };

  return (
    <>
    <div>
    </div>
    <div className="max-w-5xl mx-auto p-4 bg-gray-50 min-h-screen my-2">
       <h1 className="text-3xl my-3 font-bold">Community Hub Page</h1>
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
            {f.replace("_", " ")}
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
    </>
  );
};

export default Reports;
