
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
      setIncidents(res.data);
    }
    fetchIncidents();
  }, []);

  const handleCardClick = (incident) => {
    setSelectedIncident(incident);
    // optional: center map on this incident
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 border-b font-bold text-xl">Incident Tracker</header>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 overflow-y-auto p-4 border-r">
          {incidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onClick={handleCardClick}
            />
          ))}
        </div>
        <div className="w-2/3">
          <IncidentMap incidents={incidents} selectedIncident={selectedIncident} />
        </div>
      </div>
    </div>
  );
}