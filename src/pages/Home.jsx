import React, { useEffect, useState } from "react";
import IncidentCard from "../components/IncidentCard";
import IncidentMap from "../components/IncidentMap";
import { getIncidents } from "../services/api";
import { getDistance } from "../utils/distance";

export default function Home() {

  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const [userLocation, setUserLocation] = useState(null);
  const [nearbyStats, setNearbyStats] = useState(null);

  // Fetch incidents
  useEffect(() => {
    async function fetchIncidents() {
      const res = await getIncidents();

      const sorted = res.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setIncidents(sorted);
    }

    fetchIncidents();
  }, []);

  // When user clicks incident card
  const handleCardClick = (incident) => {
    setSelectedIncident(incident);
  };

  // Radar calculation
  function calculateNearbyIncidents(location) {

    const within1 = incidents.filter(
      (i) =>
        i.lat &&
        i.lng &&
        getDistance(location.lat, location.lng, i.lat, i.lng) <= 1
    );

    const within5 = incidents.filter(
      (i) =>
        i.lat &&
        i.lng &&
        getDistance(location.lat, location.lng, i.lat, i.lng) <= 5
    );

    const within10 = incidents.filter(
      (i) =>
        i.lat &&
        i.lng &&
        getDistance(location.lat, location.lng, i.lat, i.lng) <= 10
    );

    setNearbyStats({
      within1: within1.length,
      within5: within5.length,
      within10: within10.length,
    });
  }

  // When user selects address or map location
  function handleLocationSelect(location) {
    setUserLocation(location);
    calculateNearbyIncidents(location);
  }

  return (
    <div className="flex flex-col h-screen">

      {/* HERO */}
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

      {/* MAP */}
      <div className="w-full h-96 md:h-[500px]">

        <IncidentMap
          incidents={incidents}
          selectedIncident={selectedIncident}
          onLocationSelect={handleLocationSelect}
        />

      </div>

      {/* RADAR PANEL */}
      {nearbyStats && (
        <div className="bg-white p-4 m-4 rounded-lg shadow">

          <h2 className="font-bold text-lg mb-2">
            📡 Nearby Incident Radar
          </h2>

          <p>🚨 {nearbyStats.within1} incidents within 1km</p>
          <p>⚠️ {nearbyStats.within5} incidents within 5km</p>
          <p>📍 {nearbyStats.within10} incidents within 10km</p>

        </div>
      )}

      {/* INCIDENT FEED */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 border-t">

        {incidents.map((incident) => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            onClick={handleCardClick}
          />
        ))}

      </div>

    </div>
  );
}