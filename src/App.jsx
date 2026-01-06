import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. ROUTES WITHOUT NAVBAR (Public) */}
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />

        {/* 2. ROUTES WITH NAVBAR (Private/Internal) */}
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
        </Route>

        {/* 3. CATCH-ALL (Optional: Redirect unknown pages to Sign In) */}
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App;
