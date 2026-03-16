// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ManagerDashboard from "./components/ManagerDashboard";
import SecurityDashboard from "./components/SecurityDashboard";
import IncidentForm from "./components/IncidentForm";
import Navbar from "./components/Navbar";
import { register } from "./serviceWorkerRegistration"; // PWA service worker

export default function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  // Listen for PWA install event
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("User response to install:", outcome);
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  // Register service worker
  useEffect(() => {
    register();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        {showInstallBtn && (
          <div className="p-2 bg-blue-500 text-white text-center cursor-pointer" onClick={handleInstallClick}>
            Install WatchRadar
          </div>
        )}
        <div className="p-4">
          <Routes>
            <Route path="/" element={<ManagerDashboard />} />
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="/security" element={<SecurityDashboard />} />
            <Route path="/report" element={<IncidentForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}