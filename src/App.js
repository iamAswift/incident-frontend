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
  const [isMobile, setIsMobile] = useState(false);
  const [isIos, setIsIos] = useState(false);

  // Detect mobile / iOS devices
  useEffect(() => {
    const ua = navigator.userAgent;
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(ua));
    setIsIos(/iPhone|iPad|iPod/i.test(ua));
  }, []);

  // Listen for PWA install prompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Handle install click
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

        {/* PWA Install Button */}
        {showInstallBtn && (
          <div className="p-2 text-white text-center font-semibold rounded shadow m-4">
            {isIos ? (
              <div className="bg-blue-500 animate-pulse">
                📱 Tap Share → Add to Home Screen to install WatchRadar
              </div>
            ) : isMobile ? (
              <div
                className="bg-green-500 cursor-pointer animate-pulse"
                onClick={handleInstallClick}
              >
                📱 Install WatchRadar on your mobile 
              </div>
            ) : (
              <div
                className="bg-yellow-500 cursor-pointer animate-bounce"
                onClick={handleInstallClick}
              >
                🚀 Install WatchRadar
              </div>
            )}
          </div>
        )}

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