// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import IncidentForm from "../components/IncidentForm";
import IncidentMap from "../components/IncidentMap";
import IncidentCard from "../components/IncidentCard";
import { getIncidents } from "../services/api";

export default function UserDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Fetch incidents from backend and sort by newest first
  const fetchIncidents = async () => {
    try {
      const res = await getIncidents();
      const sorted = res.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setIncidents(sorted);
    } catch (err) {
      console.error("Error fetching incidents:", err);
    }
  };

  useEffect(() => {
    fetchIncidents();
    // Refresh incidents every 30s
    const interval = setInterval(fetchIncidents, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen">

      {/* Hero / Dashboard Header */}
      <section className="bg-gray-50 py-6 border-b text-center">
        <h1 className="text-3xl font-bold mb-2">📍 WatchRadar Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Submit incidents and track community reports in real-time
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Report incidents • View alerts • Keep your community safe
        </p>
      </section>

      <div className="flex flex-1 overflow-hidden p-4">

        {/* Left column: Incident submission + feed */}
        <div className="w-1/3 flex flex-col overflow-y-auto pr-4">
          
          {/* Submission Form */}
          <IncidentForm
            location={selectedLocation}
            onSubmitSuccess={fetchIncidents}
          />

          {/* Incident Feed */}
          <h2 className="font-bold text-lg mb-2 mt-4">Community Incident Feed</h2>
          <div className="flex-1 overflow-y-auto">
            {incidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
              />
            ))}
          </div>
        </div>

        {/* Right column: Map */}
        <div className="w-2/3">
          <IncidentMap
            incidents={incidents}
            selectedIncident={selectedLocation}
            onMapClick={setSelectedLocation} // clicking map sets form location
          />
        </div>

      </div>
    </div>
  );
}