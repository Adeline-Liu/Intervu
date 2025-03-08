import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CoverPage from "./pages/CoverPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Router>
      <div className="mx-auto max-h-screen overflow-y-auto ">
        <Routes>
          <Route path="/" element={<CoverPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
