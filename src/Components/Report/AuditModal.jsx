import React from "react";
import { 
  X, 
  Award, 
  ThumbsUp, 
  ThumbsDown, 
  CloudRain, 
  User, 
  Layers 
} from "lucide-react";

const AuditModal = ({ isOpen, onClose, report }) => {
  if (!isOpen || !report) return null;

  const score = report.validationResult?.confidenceScore || 0;
  const isFlood = report.type.toUpperCase().includes("FLOOD");
  
  // Extract user metadata with fallback for anonymous entries
  const reporterName = report.user?.name || "Anonymous System User";
  
  // Extract the decoupled social match indicator flag from newsMatch
  const isSocialVerified = report.validationResult?.newsMatch || false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
        
        {/* Modal Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-800 text-base">System Validation Audit</h3>
            <p className="text-xs text-gray-500">Report ID: #{report.id?.slice(0, 8)}...</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content Summary Body */}
        <div className="p-6 space-y-5">
          
          {/* Metadata Bar: Reporter Identity */}
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
            <User size={14} className="text-gray-400" />
            <span className="font-medium">Filed By:</span>
            <span className="font-bold text-gray-800">{reporterName}</span>
          </div>
          
          {/* Main Scoring Gauge */}
          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 rounded-lg text-white">
                <Award size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-900 uppercase tracking-wider">Confidence Engine Score</p>
                <p className="text-xs text-blue-700">Threshold required for verification: 75%</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-blue-900">{score}%</span>
            </div>
          </div>

          {/* Telemetry Breakdown Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rule Engine Inputs Metrics</h4>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Upvotes Card */}
              <div className="border border-gray-100 p-3 rounded-xl flex items-center gap-2.5">
                <ThumbsUp size={16} className="text-emerald-600" />
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Upvotes</p>
                  <p className="text-sm font-bold text-gray-700">{report.upvotesCount || 0}</p>
                </div>
              </div>

              {/* Downvotes Card */}
              <div className="border border-gray-100 p-3 rounded-xl flex items-center gap-2.5">
                <ThumbsDown size={16} className="text-rose-600" />
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Downvotes</p>
                  <p className="text-sm font-bold text-gray-700">{report.downvotesCount || 0}</p>
                </div>
              </div>

              {/* Weather Match State (Floods Only) */}
              {isFlood && (
                <div className="border border-gray-100 p-3 rounded-xl flex items-center gap-2.5 col-span-2">
                  <CloudRain size={16} className="text-blue-500" />
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-gray-400 font-medium">Weather API Correlation</p>
                      <p className="text-xs font-semibold text-gray-700">
                        {report.validationResult?.weatherMatch ? "Rainfall Detected (>0mm)" : "No Rainfall Logged"}
                      </p>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${report.validationResult?.weatherMatch ? "bg-emerald-500" : "bg-rose-500"}`} />
                  </div>
                </div>
              )}

              {/* Social Proof Proximity Match State (Floods Only) */}
              {isFlood && (
                <div className="border border-gray-100 p-3 rounded-xl flex items-center gap-2.5 col-span-2">
                  <Layers size={16} className="text-indigo-500" />
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-gray-400 font-medium">Spatial Social Proof Matrix</p>
                      <p className="text-xs font-semibold text-gray-700">
                        {isSocialVerified 
                          ? "Nearby Active Reports Detected (≥1)" 
                          : "Isolated Report Event (0 Nearby)"}
                      </p>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${isSocialVerified ? "bg-emerald-500" : "bg-rose-500"}`} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Environmental Systems Summary Log */}
          <div className="bg-gray-50 rounded-xl p-3 border text-[11px] text-gray-600 leading-relaxed">
            <span className="font-bold text-gray-700 block mb-0.5">Automated Rule Output:</span>
            {score >= 75 
              ? "This report satisfied the core parameters framework conditions and has been marked as valid infrastructure crisis telemetry."
              : "This report currently holds insufficient validation matrix parameters weight and remains under live observation tracking queue."}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3.5 bg-gray-50 border-t flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-1.5 bg-white border rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition shadow-sm"
          >
            Dismiss Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditModal;