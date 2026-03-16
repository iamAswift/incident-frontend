// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import ManagerDashboard from "./components/ManagerDashboard";
import SecurityDashboard from "./components/SecurityDashboard";
import IncidentForm from "./components/IncidentForm";
import Navbar from "./components/Navbar";

export default function App() {
  // Mock login / user selection for MVP
  const [userType, setUserType] = useState("manager"); 

  return (
    <Router>
      <Navbar />

      <div className="p-4">
        {/* Simple user type switch for MVP */}
        <div className="mb-4 space-x-2">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => setUserType("manager")}
          >
            Manager
          </button>
          <button
            className="px-3 py-1 bg-green-500 text-white rounded"
            onClick={() => setUserType("security")}
          >
            Security
          </button>
          <button
            className="px-3 py-1 bg-yellow-500 text-white rounded"
            onClick={() => setUserType("reporter")}
          >
            Report Incident
          </button>
        </div>

        {/* Conditional rendering based on userType */}
        {userType === "manager" && <ManagerDashboard />}
        {userType === "security" && <SecurityDashboard />}
        {userType === "reporter" && <IncidentForm />}
      </div>
    </Router>
  );
}