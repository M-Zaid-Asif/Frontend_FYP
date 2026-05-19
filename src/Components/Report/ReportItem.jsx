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
  AlertTriangle,
} from "lucide-react";
import axiosApi from "../../axiosApi";
import { formatDistanceToNow } from "date-fns";
import FactorRow from "./FactorRow";

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

  const tier = getTierMeta(report);
  const isCritical = report.validationResult?.confidenceScore >= 80;
  const isEarthquake = report.type.toUpperCase().includes("EARTHQUAKE");

  const fetchAIInsight = async () => {
    if (aiExplanation || isAiLoading) return;
    setIsAiLoading(true);
    try {
      const res = await axiosApi.post("/users/explainDecision", {
        report: {
          type: report.type,
          location: report.locationName,
          status: report.validationResult?.decision || "PENDING",
          upvotes: report.upvotesCount,
          confidence: report.validationResult?.confidenceScore || 0,
        },
      });
      setAiExplanation(res.data.data.explanation);
    } catch (err) {
      setAiExplanation("AI analysis unavailable at the moment.");
      void err;
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div
      className={`bg-white p-5 rounded-xl border transition-all ${isCritical ? "border-red-500 shadow-lg" : "border-gray-100"}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 px-2 py-1 rounded bg-gray-100">
          <span
            className={`w-2 h-2 rounded-full ${isEarthquake ? "bg-orange-500" : "bg-blue-500"}`}
          ></span>
          <span className="text-[10px] font-bold text-gray-600 tracking-wider uppercase">
            {report.type}
          </span>
        </div>
        <span
          className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${tier.bg} ${tier.color} border`}
        >
          {tier.label}
        </span>
      </div>

      <h2 className="font-bold text-lg text-gray-800 leading-tight">
        {report.title}
      </h2>
      <p className="text-gray-600 text-sm mt-1">{report.description}</p>

      <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500 border-y py-3">
        <span className="flex items-center gap-1">
          <MapPin size={14} /> {report.locationName}
        </span>
        <span className="flex items-center gap-1">
          <User size={14} /> {report.user?.name || "Anonymous"}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} />{" "}
          {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => handleVote(report.id, 1)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition ${report.userVote === 1 ? "bg-green-50 border-green-200 text-green-700" : "hover:bg-gray-50"}`}
          >
            <ThumbsUp
              size={16}
              fill={report.userVote === 1 ? "currentColor" : "none"}
            />{" "}
            {report.upvotesCount}
          </button>
          <button
            onClick={() => handleVote(report.id, -1)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition ${report.userVote === -1 ? "bg-red-50 border-red-200 text-red-700" : "hover:bg-gray-50"}`}
          >
            <ThumbsDown
              size={16}
              fill={report.userVote === -1 ? "currentColor" : "none"}
            />{" "}
            {report.downvotesCount}
          </button>
        </div>

        <div className="space-y-1">
          {!isEarthquake && (
            <FactorRow
              label="Weather Data Match"
              match={tier.breakdown.primarySource}
            />
          )}

          <FactorRow label="Community Trust" match={tier.breakdown.community} />

          {!isEarthquake && (
            <FactorRow
              label="Social Proof"
              match={tier.breakdown.socialProof}
            />
          )}
        </div>
      </div>

      <div
        onClick={fetchAIInsight}
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

      <button
        onClick={() =>
          setActiveReportId(activeReportId === report.id ? null : report.id)
        }
        className="mt-4 flex items-center gap-2 text-sm text-gray-600 font-medium hover:text-blue-600 transition"
      >
        <MessageSquare size={16} />{" "}
        {activeReportId === report.id ? "Hide Comments" : "Show Comments"}
      </button>

      {activeReportId === report.id && (
        <CommentSection reportId={report.id} currentUser={currentUser} />
      )}
    </div>
  );
};

export default ReportItem;
