import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Send,
  AlertTriangle,
  RotateCcw,
  Info,
  ArrowUp,
} from "lucide-react";
import axiosApi from "../axiosApi";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Monitor scroll position to show/hide the "Back to Search" button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getRescueInfo = async (query) => {
    if (!query.trim()) return;
    setChatLog((prev) => [...prev, { role: "user", text: query }]);
    setLoading(true);

    try {
      const response = await axiosApi.post("/users/ask", { message: query });
      const data = response.data.data;
      setChatLog((prev) => [...prev, { role: "bot", ...data }]);
    } catch (error) {
      setChatLog((prev) => [
        ...prev,
        { role: "bot", reply: "No data found for this keyword." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      {/* 1. FLOATING BACK TO SEARCH BUTTON */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold hover:bg-indigo-700 transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <ArrowUp size={20} />
          Back to Search
        </button>
      )}

      {/* 2. NORMAL HEADER: Not sticky anymore */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto p-6 sm:p-10">
          <h1 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <Info className="text-indigo-600" size={32} /> Rescue Knowledge Base
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              getRescueInfo(message);
              setMessage("");
            }}
            className="relative flex items-center mb-6"
          >
            <input
              className="w-full p-5 bg-gray-50 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-lg"
              placeholder="Search (e.g. Choking, Burn...)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-4 bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition shadow-lg"
            >
              <Send size={24} />
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {suggestions.map((chip) => (
              <button
                key={chip}
                onClick={() => getRescueInfo(chip)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all text-gray-600 shadow-sm"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 3. CONTENT AREA */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-10 space-y-16 mb-32">
        {chatLog.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-gray-300">
            <ShieldCheck size={100} className="opacity-10 mb-6" />
            <p className="text-xl font-medium">
              Search an emergency keyword above
            </p>
          </div>
        ) : (
          chatLog.map((chat, idx) => (
            <div
              key={idx}
              className={`flex ${
                chat.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-3xl max-w-[95%] md:max-w-[85%] shadow-xl border ${
                  chat.role === "user"
                    ? "bg-indigo-600 text-white border-indigo-700 p-6 rounded-br-none"
                    : "bg-gray-50 border-gray-100 p-0 overflow-hidden"
                }`}
              >
                {chat.role === "user" ? (
                  <p className="text-xl font-bold">{chat.text}</p>
                ) : (
                  <div className="flex flex-col bg-white">
                    {chat.verified && (
                      <div className="bg-green-600 px-6 py-3 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-white" />
                        <span className="text-xs font-black text-white uppercase tracking-widest">
                          Verified Medical Info
                        </span>
                      </div>
                    )}

                    <div className="p-8 space-y-8">
                      <h3 className="text-4xl font-black text-gray-900 border-b pb-6">
                        {chat.title || "Note"}
                      </h3>

                      {chat.reply ? (
                        <p className="text-gray-600 text-xl leading-relaxed">
                          {chat.reply}
                        </p>
                      ) : (
                        <div className="space-y-10">
                          {chat.recoveryPosition && (
                            <div>
                              <p className="text-sm font-black text-blue-600 uppercase flex items-center gap-2 mb-4">
                                <RotateCcw size={20} /> Recovery Position
                              </p>

                              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-gray-700 text-xl leading-relaxed">
                                {chat.recoveryPosition}
                              </div>
                            </div>
                          )}

                          {chat.steps && (
                            <div>
                              <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
                                Rescue Steps
                              </p>
                              <div className="text-gray-800 leading-relaxed whitespace-pre-line bg-gray-50 p-8 rounded-2xl border border-gray-200 text-2xl shadow-inner font-medium">
                                {chat.steps}
                              </div>
                            </div>
                          )}

                          {chat.precautions && (
                            <div className="bg-red-50 p-8 rounded-2xl border-l-8 border-red-500 shadow-lg">
                              <p className="text-sm font-black text-red-600 uppercase flex items-center gap-2 mb-3">
                                <AlertTriangle size={24} /> Critical Precautions
                              </p>
                              <p className="text-red-900 font-black italic leading-relaxed text-xl">
                                "{chat.precautions}"
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex items-center gap-4 text-indigo-600 font-black animate-pulse py-10">
            <div className="w-4 h-4 bg-indigo-600 rounded-full"></div>
            ACCESSING MEDICAL RECORDS...
          </div>
        )}
      </main>
    </div>
  );
};

export default Chatbot;
