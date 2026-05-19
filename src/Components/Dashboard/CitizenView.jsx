import React from "react";
import { Toaster } from "react-hot-toast";
import Weather from "../Weather";
import CitizenActions from "./CitizenActions";
import UserActivity from "./UserActivity";

const CitizenView = ({
  reports,
  showAll,
  setShowAll,
  navigate,
  handleDeleteReport,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Weather Banner */}
        <Weather />

        {/* Action Grid */}
        <CitizenActions navigate={navigate} />

        {/* User Activity */}
        <UserActivity
          reports={reports}
          showAll={showAll}
          setShowAll={setShowAll}
          navigate={navigate}
          handleDeleteReport={handleDeleteReport}
        />
      </div>
    </div>
  );
};

export default CitizenView;