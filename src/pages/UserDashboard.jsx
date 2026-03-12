import React, { useEffect, useState } from "react";
import IncidentForm from "../components/IncidentForm";
import IncidentMap from "../components/IncidentMap";
import IncidentCard from "../components/IncidentCard";
import { getIncidents } from "../services/api";

export default function UserDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

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
    const interval = setInterval(fetchIncidents, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen p-4">

      <h1 className="text-2xl font-bold mb-4">📍 WatchRadar — Submit & Track Incidents</h1>

      <div className="flex flex-1 overflow-hidden gap-4">

        {/* LEFT COLUMN: Form + Feed */}
        <div className="w-1/3 flex flex-col overflow-y-auto">
          {/* Incident Form */}
          <div className="mb-4 p-4 bg-white rounded shadow">
            <IncidentForm
              location={selectedLocation}
              onSubmitSuccess={fetchIncidents}
            />
          </div>

          {/* Incident Feed */}
          <div className="flex-1 p-2 bg-gray-50 border rounded overflow-y-auto">
            {incidents.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Map */}
        <div className="w-2/3 relative flex-1">
          <div className="absolute inset-0 rounded overflow-hidden shadow">
            <IncidentMap
              incidents={incidents}
              onMapClick={setSelectedLocation}
            />
          </div>
        </div>

      </div>
    </div>
  );
}