// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import IncidentForm from "../components/IncidentForm";
import IncidentMap from "../components/IncidentMap";
import IncidentCard from "../components/IncidentCard";
import { getIncidents } from "../services/api";

export default function UserDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Fetch incidents from backend
  const fetchIncidents = async () => {
    try {
      const res = await getIncidents();
      console.log("INCIDENT API DATA:", res.data); // Debug log
      setIncidents(res.data);
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
    <div className="p-4" style={{ height: "100vh", width: "100%" }}>
      <h1 className="text-xl font-bold mb-4">Incident Reporting</h1>

      {/* Incident submission form */}
      <IncidentForm
        location={selectedLocation}       // Auto-fill lat/lng from map
        onSubmitSuccess={fetchIncidents}  // Refresh incidents after submit
      />

      {/* Map */}
      <div style={{ height: "500px", marginBottom: "20px" }}>
        <IncidentMap
          incidents={incidents}
          onMapClick={setSelectedLocation} // Clicking map sets selected location
        />
      </div>

      {/* Incident feed */}
      <h2 className="mt-6 font-semibold">Incident Feed</h2>
      {incidents.map((incident) => (
        <IncidentCard
          key={incident.id}
          incident={incident}
        />
      ))}
    </div>
  );
}