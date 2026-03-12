
import React, { useEffect, useState } from "react";
import IncidentCard from "../components/IncidentCard";
import IncidentMap from "../components/IncidentMap";
import { getIncidents } from "../services/api";

export default function Home() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    async function fetchIncidents() {
      const res = await getIncidents();

      // Sort by created_at descending (latest first)
      const sorted = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setIncidents(sorted);
    }
    fetchIncidents();
  }, []);

  const handleCardClick = (incident) => {
    setSelectedIncident(incident);
    // optional: center map on this incident
  };

  return (
    <div className="flex flex-col h-screen">

      {/* HERO SECTION */}

      <section className="bg-gray-50 py-6 border-b text-center">
          <h1 className="text-3xl font-bold mb-2">📍 WatchRadar</h1>

          <p className="text-gray-600 mt-2">
            A community-powered incident map helping citizens stay informed
            and make safer decisions in real time.
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Report incidents • View community alerts • Help keep others safe.
          </p>
      </section>

      {/* EXISTING HEADER */}
      <header className="p-4 border-b font-bold text-lg text-gray-700">
        Community Incident Map
      </header>

      {/* EXISTING MAP + LIST */}
      <div className="flex flex-1 overflow-hidden">

        {/* INCIDENT LIST */}
        <div className="w-1/3 overflow-y-auto p-4 border-r bg-gray-50">
          {incidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onClick={handleCardClick}
            />
          ))}
        </div>

        {/* INCIDENT MAP */}
        <div className="w-2/3">
          <IncidentMap incidents={incidents} selectedIncident={selectedIncident} />
        </div>
      </div>
    </div>
  );
}