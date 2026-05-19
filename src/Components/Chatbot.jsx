import React, { useState } from "react";
import { 
  ShieldCheck, Send, RotateCcw, Info, X, 
  AlertTriangle, ArrowRight, LifeBuoy 
} from "lucide-react";
import axiosApi from "../axiosApi";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // State for the active modal data
  const [activeInstruction, setActiveInstruction] = useState(null);

const suggestions = [
    "Drowning",
    "Choking",
    "Severe Bleeding",
    "Heat Stroke",
    "Electrocution",
    "Earthquake",
    "Hypothermia",
    "Unconsciousness",
    "Fractures",
    "Head Injury",
    "Crush Injury",
    "Snake/Insect Bite",
    "Burn Injury",
    "Flash Flood",
  ];

  const getRescueInfo = async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await axiosApi.post("/users/ask", { message: query });

      // Open the modal with the new data
      setActiveInstruction(response.data.data);
    } catch (error) {
      setActiveInstruction({ 
        role: "bot", 
        reply: "No data found for this keyword. Please contact 1122 immediately." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 sm:p-12 relative">
      
      {/* HEADER & SEARCH AREA */}
      <div className="max-w-3xl w-full text-center space-y-8 mt-10">
        <div className="space-y-2">
          <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LifeBuoy className="text-indigo-600" size={32} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Rescue Knowledge</h1>
          <p className="text-gray-500">Instant first-aid and disaster instructions.</p>
        </div>

        <form 
          onSubmit={(e) => { e.preventDefault(); getRescueInfo(message); setMessage(""); }}
          className="relative group"
        >
          <input
            className="w-full p-6 bg-white rounded-3xl shadow-xl border-none focus:ring-4 focus:ring-indigo-500/10 outline-none text-xl transition-all"
            placeholder="Type a condition (e.g. Burn)..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="absolute right-3 top-3 bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 transition shadow-lg">
            {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent animate-spin rounded-full"/> : <Send size={24} />}
          </button>
        </form>

        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((chip) => (
            <button
              key={chip}
              onClick={() => getRescueInfo(chip)}
              className="px-5 py-2.5 bg-white border border-gray-100 rounded-full text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all text-gray-600 shadow-sm"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* --- INSTRUCTION MODAL --- */}
      {activeInstruction && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" 
            onClick={() => setActiveInstruction(null)}
          />

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-2xl max-h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-indigo-600 rounded-full"/>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                  {activeInstruction.title || "Rescue Protocol"}
                </h3>
              </div>
              <button 
                onClick={() => setActiveInstruction(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-8 overflow-y-auto space-y-8">
              {activeInstruction.verified && (
                <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center gap-3">
                  <ShieldCheck className="text-green-600" size={20} />
                  <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Medical Accuracy Verified</span>
                </div>
              )}

              {activeInstruction.reply ? (
                <p className="text-xl text-gray-600 leading-relaxed font-medium">
                  {activeInstruction.reply}
                </p>
              ) : (
                <div className="space-y-10">
                  {activeInstruction.steps && (
                    <div className="space-y-4">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Execution Steps</p>
                      <div className="bg-gray-50 p-6 rounded-3xl text-xl leading-relaxed text-gray-800 whitespace-pre-line border border-gray-100">
                        {activeInstruction.steps}
                      </div>
                    </div>
                  )}

                  {activeInstruction.precautions && (
                    <div className="bg-red-50 p-6 rounded-3xl border-l-8 border-red-500">
                      <div className="flex items-center gap-2 mb-2 text-red-600">
                        <AlertTriangle size={20} />
                        <span className="text-xs font-black uppercase tracking-widest">Critical Warning</span>
                      </div>
                      <p className="text-red-900 font-bold italic text-lg leading-relaxed">
                        "{activeInstruction.precautions}"
                      </p>
                    </div>
                  )}

                  {activeInstruction.recoveryPosition && (
                    <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                      <p className="text-blue-600 font-black text-xs uppercase flex items-center gap-2 mb-3">
                        <RotateCcw size={16} /> Recovery Position
                      </p>
                      <p className="text-blue-900 text-lg">{activeInstruction.recoveryPosition}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Always prioritize calling 1122 in critical situations</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;