import React, { useState, useEffect } from "react";
import { Search, MapPin, AlertCircle, User } from "lucide-react";
import axiosApi from "../axiosApi";

const Reports = () => {
  const [allReports, setAllReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await axiosApi.get("/users/getAllReports");
        setAllReports(res.data.data);
        setFilteredReports(res.data.data);
      } catch (err) {
        console.error("Error loading communal reports");
      }
    };
    fetchAllData();
  }, []);

  // Search Logic: Filters by title or location name
  useEffect(() => {
    const results = allReports.filter(report =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.locationName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReports(results);
  }, [searchTerm, allReports]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Communal Report Feed</h1>
      
      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input 
          className="w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500"
          placeholder="Search by city or disaster type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* The List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white border p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-red-500" size={18} />
                <h3 className="text-xl font-bold uppercase">{report.type}</h3>
              </div>
              <h2 className="text-2xl font-semibold mb-2">{report.title}</h2>
              <p className="text-gray-600 mb-4">{report.description}</p>
              
              <div className="flex gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><MapPin size={14}/> {report.locationName}</span>
                <span className="flex items-center gap-1"><User size={14}/> By: {report.user.name}</span>
              </div>
            </div>
            
            <div className="md:w-32 flex items-center justify-center border-l pl-6">
               <span className={`px-4 py-2 rounded-full font-bold text-xs ${
                 report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
               }`}>
                 {report.status}
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;