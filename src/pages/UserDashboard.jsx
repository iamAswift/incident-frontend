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

      {/* INCIDENT FORM */}
      <div className="mb-4 p-4 bg-white rounded shadow">
        <IncidentForm
          location={selectedLocation}
          onSubmitSuccess={fetchIncidents}
        />
      </div>

      {/* MAP */}
      <div className="w-full h-96 md:h-[500px] mb-4">
        <IncidentMap
          incidents={incidents}
          onMapClick={setSelectedLocation}
        />
      </div>

      {/* INCIDENT FEED */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 border-t">
        {incidents.map((incident) => (
          <IncidentCard key={incident.id} incident={incident} />
        ))}
      </div>
    </div>
  );
}