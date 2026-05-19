import React from "react";
import { Edit2, Trash2, ExternalLink } from "lucide-react";

const CommunalFeed = ({ reports, user, navigate, handleDeleteReport }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Live Communal Feed</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {reports.slice(0, 10).map((report) => (
          <div
            key={report.id}
            className="p-5 flex justify-between items-center hover:bg-gray-50 transition"
          >
            <div className="flex-1">
              <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase">
                {report.type}
              </span>
              <h3 className="font-bold text-gray-900">{report.title}</h3>
              <p className="text-xs text-gray-400">{report.locationName}</p>
            </div>

            <div className="flex items-center gap-3">
              {report.userId === user.id ? (
                <div className="flex gap-2 border-r pr-3 border-gray-100">
                  <button
                    onClick={() => navigate(`/updateReport/${report.id}`)}
                    className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
                    title="Edit your report"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                    title="Delete your report"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest px-2 italic">
                  External Report
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunalFeed;
