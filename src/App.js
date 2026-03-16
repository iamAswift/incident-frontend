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

  // Detect platform
  const isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);

  // Register service worker
  useEffect(() => {
    register();
  }, []);

  // Android: Listen for beforeinstallprompt
  useEffect(() => {
    if (!isAndroid) return;

    const handler = (e) => {
      e.preventDefault();
      console.log("beforeinstallprompt fired:", e);
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [isAndroid]);

  // Handle install click (Android)
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("User response to install:", outcome);
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* PWA Install Button */}
        <div className="p-4">
          {/* iOS instruction */}
          {isIos && (
            <div className="p-2 bg-blue-500 text-white text-center font-semibold rounded shadow animate-pulse">
              📱 Tap Share → Add to Home Screen to install WatchRadar
            </div>
          )}

          {/* Android install button */}
          {isAndroid && showInstallBtn && (
            <div
              className="p-2 bg-green-500 text-white text-center font-semibold rounded shadow cursor-pointer animate-pulse"
              onClick={handleInstallClick}
            >
              📱 Install WatchRadar on your mobile
            </div>
          )}

          {/* Desktop install button */}
          {!isIos && !isAndroid && showInstallBtn && (
            <div
              className="p-2 bg-yellow-500 text-white text-center font-semibold rounded shadow cursor-pointer animate-bounce"
              onClick={handleInstallClick}
            >
              🚀 Install WatchRadar
            </div>
          )}
        </div>

        {/* Main content */}
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