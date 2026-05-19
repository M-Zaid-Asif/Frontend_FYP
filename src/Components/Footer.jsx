import React from "react";
import { Link } from "react-router-dom";
import { Phone, BookOpen, ShieldAlert } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-12 mt-auto border-t border-white/5">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Branding & Mission */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="text-red-500" size={24} />
            <h4 className="font-black text-xl tracking-tighter uppercase">FAEAS</h4>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Providing verified emergency response data for the citizens of Pakistan. 
            Bridging the gap between citizens and formal rescue organizations.
          </p>
        </div>

        {/* Quick Access Links */}
        <div className="flex flex-col gap-4">
          <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Resources</h5>
          <nav className="flex flex-col gap-3">
            <Link 
              to="/hotlines" 
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold group"
            >
              <Phone size={16} className="group-hover:text-red-500" /> Emergency Hotlines
            </Link>
            <Link 
              to="/chatbot" 
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold group"
            >
              <BookOpen size={16} className="group-hover:text-indigo-400" /> Rescue Knowledge Base
            </Link>
          </nav>
        </div>

        {/* Emergency Status & Copyright */}
        <div className="text-left flex flex-col justify-between">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <p className="text-[10px] text-red-500 font-black uppercase tracking-tighter mb-1">Extreme Emergency</p>
            <p className="text-lg font-black text-white">Dial 1122 or 15</p>
          </div>
          <div className="mt-6 md:mt-0">
            <p className="text-xs text-gray-500 italic">© 2026 FAEAS Relief Systems.</p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;