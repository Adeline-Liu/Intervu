import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CoverPage from "./pages/CoverPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import InterviewPage from "./pages/InterviewPage";

function App() {
  return (
    <Router>
      <div className="mx-auto max-h-screen overflow-y-auto ">
        <Routes>
          <Route path="/" element={<CoverPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/mock_interview" element={<InterviewPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
