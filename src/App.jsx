import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./LandingPage";
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
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import DispatchHistoryPage from "./Components/DispatchHistoryPage";
import DispatchFormPage from "./Components/DispatchFormPage";
import FAQ from "./Components/FAQ";

 {/*  Act as a Facade for all the components */}
function App() {
  return (
    <Router>
      <Toaster />
      <NotificationHandler />
      <Routes>

        {/* ROUTES WITHOUT NAVBAR and FOOTER (Public) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

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
          <Route path="/dispatch-history" element={<DispatchHistoryPage />} />
          <Route path="/dispatch-supplies" element={<DispatchFormPage />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>

        {/* CATCH-ALL (Optional: Redirect unknown pages to Sign In) */}
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App;
