import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import UserDashboard from "./pages/UserDashboard";
import AdminPanel from "./components/AdminPanel";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<UserDashboard />} />

        <Route path="/UserDashboard" element={<UserDashboard />} />

        <Route path="/admin" element={<AdminPanel />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/Navbar" element={<Navbar />} />

      </Routes>
    </Router>
  );
}

export default App;