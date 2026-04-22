import React, { useState, useEffect, useCallback } from "react";
import { 
  Search, ThumbsUp, ThumbsDown, MapPin, User, Clock, 
  MessageSquare, Filter, CheckCircle2, XCircle, X, 
  Send, Edit3, Trash2, Brain, Loader2 
} from "lucide-react";
import axiosApi from "../axiosApi";
import { formatDistanceToNow } from "date-fns";
import toast, { Toaster } from "react-hot-toast";

/* --- NEW SUB-COMPONENT FOR AI INTEGRATION --- */
const ReportItem = ({ 
  report, 
  handleVote, 
  activeReportId, 
  setActiveReportId, 
  getTierMeta, 
  currentUser 
}) => {
  const [aiExplanation, setAiExplanation] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const tier = getTierMeta(report);
  const score = report.validationResult?.confidenceScore || 0;
  const isCritical = score >= 80;
  const isRejected = report.status === "REJECTED";

 const fetchAIInsight = async () => {
  if (aiExplanation || isAiLoading) return;
  setIsAiLoading(true);
  try {
    // Manually extract ONLY the strings. Do NOT send the whole report object.
    const cleanData = {
      type: String(report.type),
      location: String(report.locationName),
      status: String(report.status),
      upvotes: Number(report.upvotesCount)
    };

    const res = await axiosApi.post("/users/explainDecision", { report: cleanData });
    
    if (res.data.success) {
      setAiExplanation(res.data.data.explanation);
    }
  } catch (err) {
    setAiExplanation("Verified via community trust metrics.");
  } finally {
    setIsAiLoading(false);
  }
};

  return (
    <div
      className={`bg-white rounded-3xl shadow-sm border transition-all duration-300 ${
        isCritical ? "border-red-200 ring-4 ring-red-50" : "border-gray-100"
      } ${isRejected ? "opacity-60 grayscale-[0.3]" : ""}`}
    >
      <div className="p-6 flex flex-col md:flex-row gap-6">
        {/* Vote Panel */}
        <div className="flex flex-row md:flex-col items-center justify-center gap-6 md:border-r md:pr-6 border-gray-50">
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => handleVote(report.id, 1)}
              className={`p-2 rounded-xl transition-all ${
                report.userVote === 1 ? "bg-green-100 text-green-600" : "text-gray-400 hover:bg-green-50"
              }`}
            >
              <ThumbsUp size={22} fill={report.userVote === 1 ? "currentColor" : "none"} />
            </button>
            <span className="text-xs font-black text-green-600">{report.upvotesCount}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => handleVote(report.id, -1)}
              className={`p-2 rounded-xl transition-all ${
                report.userVote === -1 ? "bg-red-100 text-red-600" : "text-gray-400 hover:bg-red-50"
              }`}
            >
              <ThumbsDown size={22} fill={report.userVote === -1 ? "currentColor" : "none"} />
            </button>
            <span className="text-xs font-black text-red-500">{report.downvotesCount}</span>
          </div>
        </div>

        {/* Content Panel */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                isCritical ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"
              }`}>
                {report.type}
              </span>
              
              <div 
                onMouseEnter={fetchAIInsight}
                className={`relative group flex items-center gap-1.5 px-2 py-0.5 rounded-full border cursor-help ${tier.bg} ${tier.color} ${tier.border}`}
              >
                {isAiLoading ? <Loader2 size={12} className="animate-spin" /> : tier.icon}
                <span className="text-[10px] font-bold uppercase">{tier.label}</span>
                
                {/* TOOLTIP: Combined Factor Breakdown + AI Reasoning */}
                <div className="absolute bottom-full left-0 mb-2 w-64 p-4 bg-white border border-gray-100 shadow-2xl rounded-2xl hidden group-hover:block z-50">
                  <p className="text-[9px] font-black text-gray-400 uppercase mb-2 tracking-widest border-b pb-1 flex items-center gap-1">
                    <Brain size={10} className="text-indigo-500" /> AI & Factor Analysis
                  </p>
                  
                  {/* AI Reasoning Text */}
                  <p className="text-[11px] text-slate-700 italic mb-3 leading-relaxed">
                    {isAiLoading ? "Analyzing weights..." : aiExplanation || "Hover to analyze with AI..."}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-gray-50">
                    {report.type === "FLOOD" && (
                      <>
                        <FactorRow label="Weather Data" match={tier.breakdown.weather} />
                        <FactorRow label="Social Proof" match={tier.breakdown.social} />
                      </>
                    )}
                    <FactorRow label="Citizen Trust" match={tier.breakdown.community} />
                  </div>
                  <div className="absolute -bottom-1 left-4 w-2 h-2 bg-white border-r border-b border-gray-100 rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{report.title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{report.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-gray-400 border-t border-gray-50 pt-4">
            <span className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
              <MapPin size={12} /> {report.locationName}
            </span>
            <span className="flex items-center gap-1"><User size={12} /> {report.user?.name}</span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
            </span>
            <button
              onClick={() => setActiveReportId(activeReportId === report.id ? null : report.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ml-auto transition-colors ${
                activeReportId === report.id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              <MessageSquare size={14} /> {activeReportId === report.id ? "Hide Feed" : "Updates"}
            </button>
          </div>
        </div>
      </div>
      {activeReportId === report.id && (
        <CommentSection reportId={report.id} currentUser={currentUser} />
      )}
    </div>
  );
};

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
      console.error("User not logged in");
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    try {
      const res = await axiosApi.get("/users/getAllReports");
      setAllReports(res.data.data || []);
    } catch (err) {
      console.error("Error loading feed:", err);
    }
  }, []);

  useEffect(() => {
    fetchUser();
    fetchAllData();
  }, [fetchUser, fetchAllData]);

  useEffect(() => {
    const needsPolling = allReports.some(
      (r) => r.type === "FLOOD" && !r.validationResult
    );
    if (!needsPolling) return;
    const interval = setInterval(() => {
      fetchAllData();
    }, 5000);
    return () => clearInterval(interval);
  }, [allReports, fetchAllData]);

  const handleVote = async (reportId, value) => {
    try {
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
        })
      );
      await axiosApi.post(`/users/v/${reportId}`, { value });
    } catch (err) {
      fetchAllData();
      toast.error("Vote failed");
    }
  };

  const filteredReports = allReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.locationName?.toLowerCase().includes(searchTerm.toLowerCase());
    const result = report.validationResult;
    if (activeFilter === "CRITICAL")
      return matchesSearch && result?.confidenceScore >= 80;
    if (activeFilter === "VERIFIED")
      return matchesSearch && result?.decision === "VERIFIED";
    if (activeFilter === "REJECTED")
      return matchesSearch && result?.decision === "REJECTED";
    if (activeFilter === "PENDING")
      return matchesSearch && (!result || result.decision === "NEEDS_REVIEW");
    return matchesSearch;
  });

  const getTierMeta = (report) => {
    const result = report.validationResult;
    const currentStatus = report.status; 
    
    const breakdown = {
      weather: report.type === "FLOOD" ? (result?.weatherMatch || false) : null,
      social: report.type === "FLOOD" ? (result?.confidenceScore >= 50) : null,
      community: (report.upvotesCount || 0) > (report.downvotesCount || 0),
    };

    let meta = {
      label: "Pending",
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: <Clock size={14} />,
      breakdown,
    };

    if (currentStatus === "VERIFIED") {
      meta.label = "Verified";
      meta.color = "text-green-700";
      meta.bg = "bg-green-50";
      meta.border = "border-green-200";
      meta.icon = <CheckCircle2 size={14} />;
    } else if (currentStatus === "REJECTED") {
      meta.label = "Rejected";
      meta.color = "text-red-700";
      meta.bg = "bg-red-50";
      meta.border = "border-red-200";
      meta.icon = <X size={14} />;
    } else if (!result && report.type === "FLOOD") {
      meta.label = "Validating...";
      meta.color = "text-blue-600";
      meta.bg = "bg-blue-50";
      meta.border = "border-blue-100";
      meta.icon = <Clock size={14} className="animate-pulse" />;
    }

    return meta;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen font-sans">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Communal Feed</h1>
          <p className="text-gray-500 text-sm">Real-time disaster validation and field updates.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Total</p>
            <p className="font-bold text-gray-800">{allReports.length}</p>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-xl shadow-sm border border-green-100 text-center">
            <p className="text-[10px] font-bold text-green-400 uppercase">Verified</p>
            <p className="font-bold text-green-600">
              {allReports.filter((r) => r.status === "VERIFIED").length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          <input
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl shadow-sm border-none focus:ring-2 focus:ring-indigo-500 bg-white"
            placeholder="Search city or disaster..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["ALL", "CRITICAL", "VERIFIED", "PENDING", "REJECTED"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                activeFilter === f
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-white text-gray-500 border-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-6">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <ReportItem 
              key={report.id}
              report={report}
              handleVote={handleVote}
              activeReportId={activeReportId}
              setActiveReportId={setActiveReportId}
              getTierMeta={getTierMeta}
              currentUser={currentUser}
            />
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <Filter className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">No reports match the filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const FactorRow = ({ label, match }) => (
  <div className="flex items-center justify-between gap-2">
    <span className="text-[10px] text-gray-600 font-medium">{label}</span>
    {match ? <CheckCircle2 size={12} className="text-green-500" /> : <XCircle size={12} className="text-red-400" />}
  </div>
);

const CommentSection = ({ reportId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const fetchComments = async () => {
    try {
      const res = await axiosApi.get(`/users/${reportId}`);
      setComments(res.data.data || []);
    } catch (err) {
      console.error("Comment error", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [reportId]);

  const handleAdd = async () => {
    if (!newComment.trim()) return;
    try {
      await axiosApi.post(`/users/${reportId}`, { content: newComment });
      setNewComment("");
      fetchComments();
    } catch (err) {
      toast.error("Login to comment");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete?")) {
      try {
        await axiosApi.delete(`/users/c/${id}`);
        fetchComments();
      } catch (err) {
        toast.error("Failed");
      }
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axiosApi.patch(`/users/c/${id}`, { content: editContent });
      setEditingId(null);
      fetchComments();
    } catch (err) {
      toast.error("Failed");
    }
  };

  return (
    <div className="bg-gray-50 border-t p-6">
      <div className="space-y-4 mb-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 group">
            <div
              className={`flex-1 p-3 rounded-xl border shadow-sm ${["NGO", "ADMIN"].includes(comment.user?.role) ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-indigo-600">
                  {comment.user?.name}
                </span>
                {currentUser?.id === comment.userId && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditContent(comment.content);
                      }}
                    >
                      <Edit3
                        size={12}
                        className="text-gray-400 hover:text-blue-500"
                      />
                    </button>
                    <button onClick={() => handleDelete(comment.id)}>
                      <Trash2
                        size={12}
                        className="text-gray-400 hover:text-red-500"
                      />
                    </button>
                  </div>
                )}
              </div>
              {editingId === comment.id ? (
                <div className="flex gap-2">
                  <input
                    className="flex-1 text-sm bg-transparent border-b outline-none"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <button onClick={() => handleUpdate(comment.id)}>
                    <Send size={12} />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-700">{comment.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 bg-white p-2 rounded-xl border">
        <input
          placeholder="Add a field update..."
          className="flex-1 px-2 outline-none text-sm"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white p-2 rounded-lg"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};

export default Reports;