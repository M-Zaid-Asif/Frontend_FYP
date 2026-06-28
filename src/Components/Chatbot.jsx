import React, { useState } from "react";
import { 
  ShieldCheck, Send, RotateCcw, AlertTriangle, 
  LifeBuoy, Activity, ChevronDown, ChevronUp, FileText 
} from "lucide-react";
import axiosApi from "../axiosApi";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const getRescueInfo = async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    setExpandedIndex(null); 
    
    try {
      const response = await axiosApi.post("/users/ask", { message: query });
      
      if (Array.isArray(response.data?.data)) {
        setSearchResults(response.data.data);
        setExpandedIndex(0); // Automatically open the #1 highest matching item
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.data) {
        setSearchResults([
          {
            title: "No Match Found",
            verified: false,
            reply: error.response.data.data.reply,
            isError: true
          }
        ]);
      } else {
        setSearchResults([
          { 
            title: "Connection Error",
            verified: false, 
            reply: "Could not connect to the rescue database. Please contact emergency services (1122) immediately.",
            isError: true
          }
        ]);
      }
      setExpandedIndex(0);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-12">
      
      {/* SEARCH HEADER */}
      <div className="max-w-3xl w-full text-center space-y-6 mt-6 mb-10">
        <div className="flex items-center justify-center gap-3">
          <div className="bg-indigo-100 w-12 h-12 rounded-xl flex items-center justify-center">
            <LifeBuoy className="text-indigo-600" size={24} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Rescue Search</h1>
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); getRescueInfo(message); setMessage(""); }}
          className="relative max-w-2xl mx-auto"
        >
          <input
            className="w-full p-5 pl-6 pr-16 bg-white rounded-2xl shadow-md border border-gray-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-lg transition-all"
            placeholder="Describe the situation or injury..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="absolute right-2 top-2 bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition shadow-md">
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"/> : <Send size={20} />}
          </button>
        </form>

        {/* Suggestion Quick Chips */}
        {/* <div className="flex flex-wrap justify-center gap-1.5 max-w-2xl mx-auto">
          {suggestions.map((chip) => (
            <button
              key={chip}
              onClick={() => getRescueInfo(chip)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold hover:bg-indigo-500 hover:text-white transition-all text-gray-600 shadow-sm"
            >
              {chip}
            </button>
          ))}
        </div> */}
      </div>

      {/* RELEVANT MATCHES AREA */}
      <div className="max-w-2xl w-full space-y-4">
        {searchResults.length > 0 && (
          <div className="flex justify-between px-1 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span>Found {searchResults[0].isError ? 0 : searchResults.length} relevant guides</span>
            {searchResults.length > 1 && <span className="text-indigo-500">Sorted by relevance</span>}
          </div>
        )}

        {searchResults.map((result, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <div 
              key={index}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                result.isError 
                  ? "border-red-100 shadow-sm" 
                  : isExpanded 
                    ? "border-indigo-300 ring-4 ring-indigo-500/5 shadow-lg" 
                    : "border-gray-200 hover:border-gray-300 shadow-md"
              }`}
            >
              {/* Accordion Click Header */}
              <div 
                onClick={() => toggleExpand(index)}
                className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none hover:bg-gray-50/50 transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium tracking-wide flex items-center gap-1">
                      <FileText size={12} /> emergency // protocol {index === 0 && !result.isError && "• best match"}
                    </span>
                  </div>
                  
                  <h2 className={`text-xl font-bold tracking-tight ${result.isError ? "text-red-600" : "text-indigo-600"}`}>
                    {result.title}
                  </h2>

                  {/* Text preview when closed */}
                  {!isExpanded && (
                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                      {result.reply ? result.reply : `First-aid protocol execution for ${result.title.toLowerCase()}.`}
                    </p>
                  )}
                </div>

                <div className="text-gray-400 mt-2">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Collapsible Content Dropdown */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-gray-100 bg-white space-y-6 pt-5 animate-in fade-in duration-200">
                  
                  {/* Confidence metrics and validation badges */}
                  {result.verified && (
                    <div className="flex flex-wrap gap-2">
                      <div className="bg-green-50 border border-green-100 px-3 py-1.5 rounded-xl flex items-center gap-2">
                        <ShieldCheck className="text-green-600" size={16} />
                        <span className="text-[10px] font-black text-green-700 uppercase tracking-wider">Medical Accuracy Verified</span>
                      </div>
                      {result.confidence && (
                        <div className="bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl flex items-center gap-2">
                          <Activity className="text-blue-600" size={16} />
                          <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider">Relevance Score: {result.confidence}%</span>
                        </div>
                      )}
                    </div>
                  )}

                  {result.description && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed">
                      {result.description}
                    </div>
                  )}

                  {result.reply ? (
                    <p className="text-base text-gray-700 leading-relaxed font-medium bg-red-50/50 p-4 rounded-xl border border-red-100/60 text-center">
                      {result.reply}
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {/* Emergency steps fields */}
                      {result.steps && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.15em]">Emergency Action Steps</h4>
                          <div className="bg-gray-50 p-5 rounded-xl text-base leading-relaxed text-gray-800 whitespace-pre-line border border-gray-100">
                            {result.steps}
                          </div>
                        </div>
                      )}

                      {/* Warnings fields */}
                      {result.precautions && (
                        <div className="bg-red-50 p-5 rounded-xl border-l-4 border-red-500 space-y-1">
                          <div className="flex items-center gap-2 text-red-600">
                            <AlertTriangle size={16} />
                            <h4 className="text-xs font-black uppercase tracking-wider">Critical Precautions</h4>
                          </div>
                          <p className="text-red-900 font-medium text-sm leading-relaxed">
                            {result.precautions}
                          </p>
                        </div>
                      )}

                      {/* Positions fields */}
                      {result.recoveryPosition && (
                        <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100/50">
                          <h4 className="text-blue-700 font-black text-xs uppercase flex items-center gap-1.5 mb-1.5">
                            <RotateCcw size={14} /> Recommended Position
                          </h4>
                          <p className="text-blue-900 text-sm leading-relaxed">{result.recoveryPosition}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>Source: Emergency Core Database</span>
                    <span className="text-red-500">Emergency Line: 1122</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chatbot;