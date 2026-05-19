import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import SignUpPage from "./Components/SignUp";
import SignInPage from "./Components/SignIn";
import UserProfile from "./Components/UserProfile";
import Dashboard from "./Components/Dashboard";
import ReportSubmitForm from "./Components/ReportSubmissionForm";
import UpdateReportForm from "./Components/UpdateReport";
import Reports from "./Components/Reports";
import UpdateInventory from "./Components/UpdateInventory";
import MainLayout from "./Components/MainLayout";
import KnowledgeChat from "./Components/Chatbot";
import WeatherDisplay from "./Components/WeatherDisplay";
import MapPage from "./Components/WeatherMap";
import HotlinePage from "./Components/HotlinePage";
import NotificationHandler from "./Components/NotificationHandler";

function App() {
  return (
    <Router>
      <Toaster />
      <NotificationHandler />
      <Routes>

        {/* ROUTES WITHOUT NAVBAR and FOOTER (Public) */}
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />

     
        {/* We wrap these in MainLayout so the Navbar appears on all of them */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/userProfile" element={<UserProfile />} />
          <Route path="/submitReport" element={<ReportSubmitForm />} />
          <Route path="/reports" element={<Reports />} />
          <Route
            path="/updateReport/:reportId"
            element={<UpdateReportForm />}
          />
          <Route path="/updateInventory" element={<UpdateInventory />} />
          <Route path="/chatbot" element={<KnowledgeChat />} />
          <Route path="/weatherDisplay" element={<WeatherDisplay />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/hotlines" element={<HotlinePage />} />
        </Route>

        {/* CATCH-ALL (Optional: Redirect unknown pages to Sign In) */}
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App;
