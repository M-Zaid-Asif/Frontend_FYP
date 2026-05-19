import React from "react";
import { PlusCircle, ShieldCheck, Map as MapIcon } from "lucide-react";

const NGONavigation = ({ navigate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        onClick={() => navigate("/submitReport")}
        className="cursor-pointer bg-red-600 rounded-2xl p-6 text-white shadow-lg hover:-translate-y-1 transition-all"
      >
        <PlusCircle size={32} className="mb-4 opacity-80" />
        <h2 className="text-xl font-bold">File Field Report</h2>
        <p className="text-red-100 text-xs mb-4">
          Report new disaster sighting.
        </p>
        <span className="text-xs font-bold bg-white text-red-600 px-3 py-1 rounded-full uppercase tracking-tighter">
          New Report
        </span>
      </div>

      <div
        onClick={() => navigate("/updateInventory")}
        className="cursor-pointer bg-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:-translate-y-1 transition-all"
      >
        <ShieldCheck size={32} className="mb-4 opacity-80" />
        <h2 className="text-xl font-bold">Manage Inventory</h2>
        <p className="text-indigo-100 text-xs mb-4">
          Add/Edit food or medical stock.
        </p>
        <span className="text-xs font-bold bg-white text-indigo-600 px-3 py-1 rounded-full uppercase tracking-tighter">
          Update Stock
        </span>
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

export default NGONavigation;