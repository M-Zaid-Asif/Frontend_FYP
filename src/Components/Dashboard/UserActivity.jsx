import React from "react";
import { Edit2, Trash2 } from "lucide-react";

const UserActivity = ({
  reports,
  showAll,
  setShowAll,
  navigate,
  handleDeleteReport,
}) => {
  const displayedReports = showAll ? reports : reports.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Your Activity
        </h2>

        <button
          onClick={() => setShowAll(!showAll)}
          className="text-indigo-600 font-bold text-sm"
        >
          {showAll ? "Show Less" : "View All"}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {displayedReports.length > 0 ? (
          displayedReports.map((report) => (
            <div
              key={report.id}
              className="p-5 flex justify-between items-center hover:bg-gray-50 transition"
            >
              <div>
                <h3 className="font-bold text-gray-900">
                  {report.title}
                </h3>
                <p className="text-xs text-gray-400 italic">
                  {report.locationName}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/updateReport/${report.id}`)}
                  className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"
                >
                  <Edit2 size={16} />
                </button>

                <button
                  onClick={() => handleDeleteReport(report.id)}
                  className="p-2 bg-red-50 text-red-600 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-gray-400">
            No reports found.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivity;