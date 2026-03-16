// src/components/Navbar.jsx
import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold flex items-center space-x-2">
        <span>📍</span>
        <span>WatchRadar</span>
      </h1>
      <div className="flex space-x-4">
        <a href="/" className="hover:underline">Map</a>
        <a href="/manager" className="hover:underline">Dashboard</a>
        <a href="/report" className="hover:underline">Report Incident</a>
      </div>
    </nav>
  );
}