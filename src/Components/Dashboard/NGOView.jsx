import React from "react";
import { Toaster } from "react-hot-toast";
import Weather from "../Weather";
import ResourceInventory from "./ResourceInventory";
import NGONavigation from "./NGONavigation";
import CommunalFeed from "./CommunalFeed";

const NGOView = ({ user, reports, resources, navigate, handleDeleteReport }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              NGO Response Command
            </h1>
            <p className="text-gray-500">
              Managing disaster response for {user.name}.
            </p>
          </div>
        </header>

        <Weather />

        <ResourceInventory resources={resources} />
        <NGONavigation navigate={navigate} />
        <CommunalFeed
          reports={reports}
          user={user}
          navigate={navigate}
          handleDeleteReport={handleDeleteReport}
        />
      </div>
    </div>
  );
};

export default NGOView;