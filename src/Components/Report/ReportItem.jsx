import React, { useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  MapPin,
  User,
  Clock,
  MessageSquare,
  Brain,
  Loader2,
  Award,
} from "lucide-react";
import AuditModal from "./AuditModal";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const ReportItem = ({
  report,
  handleVote,
  activeReportId,
  setActiveReportId,
  getTierMeta,
  currentUser,
  CommentSection,
}) => {
  const [aiExplanation, setAiExplanation] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const navigate = useNavigate();

  // We still call getTierMeta purely to grab the clean color configs for the status badge
  const tier = getTierMeta(report);
  const confidenceScore = report.validationResult?.confidenceScore ?? 0;
  const isCritical = confidenceScore >= 80;

  const getScoreColor = (score) => {
    if (score >= 75) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (score >= 30) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  const handleVoteClick = async (e, reportId, voteType) => {
    e.stopPropagation();
    await handleVote(reportId, voteType);
    setAiExplanation("");
  };

  const handleAIInsightClick = (e) => {
    e.stopPropagation();
    fetchAIInsight();
  };

  const handleCommentsToggleClick = (e) => {
    e.stopPropagation();
    setActiveReportId(activeReportId === report.id ? null : report.id);
  };

  const handleViewOnMapClick = (e) => {
    e.stopPropagation();
    handleViewOnMap();
  };

  const fetchAIInsight = async () => {
    if (aiExplanation || isAiLoading) return;
    setIsAiLoading(true);
    try {
      const res = await axiosApi.post("/users/explainDecision", {
        report: {
          type: report.type,
          location: report.locationName,
          status: report.validationResult?.decision || "PENDING",
          upvotesCount: report.upvotesCount,
          downvotesCount: report.downvotesCount,
          confidence: confidenceScore,
        },
      });
      setAiExplanation(res.data.data.explanation);
    } catch (err) {
      setAiExplanation("AI analysis unavailable at the moment.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleViewOnMap = () => {
    navigate("/map", {
      state: { lat: report.latitude, lng: report.longitude, focusReportId: report.id },
    });
  };

  return (
    <>
      <div
        onClick={() => setIsAuditModalOpen(true)}
        className={`bg-white p-5 rounded-xl border cursor-pointer hover:shadow-md transition-all ${isCritical ? "border-red-500 shadow-sm" : "border-gray-100"}`}
      >
        {/* HEADER: Minimal Status Indicators */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 px-2 py-1 rounded bg-gray-100">
            <span className={`w-2 h-2 rounded-full ${report.type.toUpperCase().includes("EARTHQUAKE") ? "bg-orange-500" : "bg-blue-500"}`} />
            <span className="text-[10px] font-bold text-gray-600 tracking-wider uppercase">{report.type}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-extrabold border ${getScoreColor(confidenceScore)}`}>
              <Award size={12} />
              Match: {confidenceScore}%
            </span>
            <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${tier.bg} ${tier.color} border`}>
              {tier.label}
            </span>
          </div>
        </div>

        <h2 className="font-bold text-lg text-gray-800 leading-tight">{report.title}</h2>
        <p className="text-gray-600 text-sm mt-1">{report.description}</p>

        {/* METRICS ROW (Clean & Simple, No duplicate factor checkmarks) */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            <button
              onClick={(e) => handleVoteClick(e, report.id, 1)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition ${report.userVote === 1 ? "bg-green-50 border-green-200 text-green-700" : "hover:bg-gray-50"}`}
            >
              <ThumbsUp size={16} fill={report.userVote === 1 ? "currentColor" : "none"} /> {report.upvotesCount}
            </button>
            <button
              onClick={(e) => handleVoteClick(e, report.id, -1)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition ${report.userVote === -1 ? "bg-red-50 border-red-200 text-red-700" : "hover:bg-gray-50"}`}
            >
              <ThumbsDown size={16} fill={report.userVote === -1 ? "currentColor" : "none"} /> {report.downvotesCount}
            </button>
          </div>

          <span className="text-xs text-gray-400 italic">Click card to view verification logs</span>
        </div>

        {/* AI INSIGHT */}
        <div
          onClick={handleAIInsightClick}
          className="mt-4 p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition"
        >
          <div className="flex items-center gap-2 text-blue-800 font-semibold text-xs mb-1">
            <Brain size={14} /> AI VALIDATION INSIGHT
          </div>
          {isAiLoading ? (
            <Loader2 size={16} className="animate-spin text-blue-600" />
          ) : (
            <p className="text-xs text-blue-700 leading-relaxed italic">
              {aiExplanation || "Click to see why AI made this decision..."}
            </p>
          )}
        </div>

        {/* FOOTER STRIP */}
        <div className="mt-4 flex items-center justify-between border-t pt-3">
          <button
            onClick={handleCommentsToggleClick}
            className="flex items-center gap-2 text-sm text-gray-600 font-medium hover:text-blue-600 transition"
          >
            <MessageSquare size={16} />
            {activeReportId === report.id ? "Hide Comments" : "Show Comments"}
          </button>

          <button
            onClick={handleViewOnMapClick}
            className="flex items-center gap-1.5 text-sm text-indigo-600 font-semibold hover:text-indigo-800 transition"
          >
            <MapPin size={16} /> View on Map
          </button>
        </div>

        {activeReportId === report.id && (
          <div onClick={(e) => e.stopPropagation()}>
            <CommentSection reportId={report.id} currentUser={currentUser} />
          </div>
        )}
      </div>

      <AuditModal 
        isOpen={isAuditModalOpen} 
        onClose={() => setIsAuditModalOpen(false)} 
        report={report} 
      />
    </>
  );
};

export default ReportItem;