import React from "react";
import { PlusCircle, FileWarning, Map as MapIcon } from "lucide-react";

const CitizenActions = ({ navigate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div
        onClick={() => navigate("/submitReport")}
        className="group cursor-pointer bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
      >
        <PlusCircle className="text-indigo-600 mb-4" />
        <h3 className="text-xl font-bold text-gray-900">Submit Report</h3>
        <p className="text-gray-500 text-sm mt-1">
          Report a disaster or civic complaint.
        </p>
      </div>

      <div
        onClick={() => navigate("/reports")}
        className="group cursor-pointer bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
      >
        <FileWarning className="text-green-600 mb-4" />
        <h3 className="text-xl font-bold text-gray-900">Local Feed</h3>
        <p className="text-gray-500 text-sm mt-1">
          See alerts from other citizens.
        </p>
      </div>

      <div
        onClick={() => navigate("/map")}
        className="cursor-pointer bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
      >
        <MapIcon
          size={32}
          className="mb-4 text-gray-400 group-hover:text-indigo-600 transition-colors"
        />
        <h2 className="text-xl font-bold text-gray-900">Crisis Map</h2>
        <p className="text-gray-500 text-xs mb-4">
          View active disaster geo-tags.
        </p>
        <span className="text-xs font-bold bg-gray-100 text-gray-900 px-3 py-1 rounded-full uppercase tracking-tighter">
          Launch Fullscreen Map
        </span>
      </div>

    </div>
  );
};

export default CitizenActions;