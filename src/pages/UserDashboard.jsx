import React, { useEffect, useState } from "react";
import IncidentForm from "../components/IncidentForm";
import IncidentMap from "../components/IncidentMap";
import IncidentCard from "../components/IncidentCard";
import { getIncidents } from "../services/api";
import { getDistance } from "../utils/distance";

export default function UserDashboard() {

  const [incidents, setIncidents] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [nearbyStats, setNearbyStats] = useState(null);

  // Fetch incidents
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

  // Calculate nearby incidents
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

  // When user clicks map or searches address
  function handleLocationSelect(location) {
    setSelectedLocation(location);
    calculateNearbyIncidents(location);
  }

  return (
    <div className="flex flex-col h-screen p-4">

      <h1 className="text-2xl font-bold mb-4">
        📍 WatchRadar — Submit & Track Incidents
      </h1>

      {/* INCIDENT FORM */}
      <div className="mb-4 p-4 bg-white rounded shadow">

        <IncidentForm
          location={selectedLocation}
          onSubmitSuccess={fetchIncidents}
        />

      </div>

      {/* MAP */}
      <div className="w-full mb-4" style = {{ height: "500px", minHeight: "500px" }}>

        <IncidentMap
          incidents={incidents}
          onMapClick={handleLocationSelect}
        />

      </div>

      {/* RADAR PANEL */}
      {nearbyStats && (
        <div className="bg-white p-4 mb-4 rounded-lg shadow">

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
          />
        ))}

      </div>

    </div>
  );
}