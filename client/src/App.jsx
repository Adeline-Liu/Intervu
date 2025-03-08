import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CoverPage from "./pages/CoverPage";

function App() {
  return (
    <Router>
      <div className="mx-auto max-h-screen overflow-y-auto ">
        <Routes>
          <Route path="/" element={<CoverPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
