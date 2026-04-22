import React, { useState } from "react";
import { Phone, Globe, Search, Info, ExternalLink } from "lucide-react";

const HotlinePage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const contacts = [
    { name: "Rescue 1122", sector: "Public", focus: "Immediate Emergency & Medical Rescue", hotline: "1122", category: "Emergency", website: "https://rescue.punjab.gov.pk" },
    { name: "NDMA (National Disaster Management Authority)", sector: "Public", focus: "National Coordination & Policy", hotline: "111-157-157", category: "Federal", website: "http://www.ndma.gov.pk" },
    { name: "PDMA Punjab", sector: "Public", focus: "Provincial Relief Operations", hotline: "1129", category: "Provincial", website: "https://pdma.punjab.gov.pk" },
    { name: "PDMA Sindh", sector: "Public", focus: "Provincial Relief Operations", hotline: "1736", category: "Provincial", website: "https://pdma.sindh.gov.pk" },
    { name: "Pakistan Red Crescent", sector: "NGO", focus: "First Aid, Shelter & Blood Bank", hotline: "1030", category: "Relief", website: "https://prcs.org.pk" },
    { name: "Edhi Foundation", sector: "NGO", focus: "Ambulance Service & Mortuary", hotline: "115", category: "Relief", website: "https://edhi.org" },
    { name: "Al-Khidmat Foundation", sector: "NGO", focus: "Food, Water & Rebuilding", hotline: "111-503-504", category: "Relief", website: "https://alkhidmat.org" },
    { name: "Saylani Welfare Trust", sector: "NGO", focus: "Meals & Basic Necessities", hotline: "111-729-526", category: "Relief", website: "https://www.saylaniwelfare.com" },
    { name: "Khubaib Foundation", sector: "NGO", focus: "Medical Aid & Orphan Care", hotline: "051-4440837", category: "Relief", website: "https://khubaib.org" },
    { name: "Crisis Management Cell", sector: "Public", focus: "Federal Emergency Coordination", hotline: "051-9206111", category: "Federal", website: "https://www.interior.gov.pk" },
    { name: "AJK Emergency Cell", sector: "Public", focus: "Relief for Kashmir Region", hotline: "051-9209650", category: "Provincial", website: "http://sdma.ajk.gov.pk" },
  ];

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.focus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
            <Phone className="text-red-600" size={36} /> Emergency Directory
          </h1>
          <p className="text-gray-500 mt-2 text-lg">One-tap calling and official resources for disaster response.</p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-4 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Search organizations or provinces..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-lg focus:ring-4 focus:ring-red-500/10 text-lg outline-none bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredContacts.map((contact, index) => (
            <div key={index} className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  contact.sector === 'Public' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                }`}>
                  {contact.sector} Sector
                </span>
                <span className="text-[9px] font-bold text-gray-300 uppercase">{contact.category}</span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">{contact.name}</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">{contact.focus}</p>

              <div className="pt-4 border-t border-gray-50 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-400 uppercase">Hotline</span>
                  <span className="text-lg font-black text-gray-800">{contact.hotline}</span>
                </div>
                
                <div className="flex gap-2">
                  {/* Website Button */}
                  <a 
                    href={contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                    title="Visit Website"
                  >
                    <Globe size={20} />
                  </a>

                  {/* Call Button */}
                  <a 
                    href={`tel:${contact.hotline.replace(/-/g, '')}`}
                    className="bg-red-600 text-white px-5 py-3 rounded-xl shadow-lg shadow-red-100 hover:bg-red-700 hover:-translate-y-1 transition-all flex items-center gap-2"
                  >
                    <Phone size={18} fill="currentColor" />
                    <span className="font-black text-sm uppercase">Call Now</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex gap-4 items-start">
          <Info className="text-blue-600 shrink-0" />
          <p className="text-sm text-blue-800 leading-relaxed">
            Clicking the <Globe size={14} className="inline mx-1" /> icon will open the organization's official portal in a new tab. Use these to find detailed disaster reports, donation links, and provincial alerts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HotlinePage;