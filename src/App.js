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

  // Handle install click (Android & Desktop)
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("User response to install:", outcome);
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  // Banner visibility
  const showIosBanner = isIos && !showInstallBtn; // show iOS banner until dismissed
  const showAndroidBanner = isAndroid && showInstallBtn;
  const showDesktopBanner = !isIos && !isAndroid && showInstallBtn;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* PWA Install Banners */}
        {showIosBanner && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 md:w-2/3 bg-blue-500 text-white text-center font-semibold rounded-xl shadow-lg p-4 flex flex-col md:flex-row items-center justify-between gap-2 z-50">
            <span className="text-sm md:text-base">
              📱 Tap <strong>Share</strong> → <strong>Add to Home Screen</strong> to install WatchRadar
            </span>
            <button
              className="bg-white text-blue-500 px-3 py-1 rounded font-semibold hover:bg-gray-100"
              onClick={() => setShowInstallBtn(true)} // dismiss sets Android banner ready if available
            >
              ✖ Dismiss
            </button>
          </div>
        )}

        {showAndroidBanner && (
          <div
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-11/12 md:w-2/3 bg-green-500 text-white text-center font-semibold rounded-xl shadow-lg p-4 cursor-pointer animate-pulse z-50"
            onClick={handleInstallClick}
          >
            📱 Install WatchRadar on your mobile
          </div>
        )}

        {showDesktopBanner && (
          <div
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-1/3 bg-yellow-500 text-white text-center font-semibold rounded-xl shadow-lg p-4 cursor-pointer animate-bounce z-50"
            onClick={handleInstallClick}
          >
            🚀 Install WatchRadar
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