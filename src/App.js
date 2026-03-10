import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import UserDashboard from "./pages/UserDashboard";
import AdminPanel from "./components/AdminPanel";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<UserDashboard />} />

        <Route path="/UserDashboard" element={<UserDashboard />} />

        <Route path="/admin" element={<AdminPanel />} />

        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;