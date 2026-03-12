// src/components/IncidentMap.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom icons
const icons = {
  bandit: new L.Icon({ iconUrl: "/icons8-marker-b-50.png", iconSize: [25, 41], iconAnchor: [12, 41] }),
  accident: new L.Icon({ iconUrl: "/icons8-car-accident-50.png", iconSize: [25, 41], iconAnchor: [12, 41] }),
  robbery: new L.Icon({ iconUrl: "/icons8-robbery-80.png", iconSize: [25, 41], iconAnchor: [12, 41] }),
  kidnapping: new L.Icon({ iconUrl: "/icons8-hostage-64.png", iconSize: [25, 41], iconAnchor: [12, 41] }),
};

// Map click handler
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function IncidentMap({ incidents = [], onMapClick }) {
  console.log("IncidentMap incidents:", incidents);

  return (
    <div style={{ width: "100%", height: "500px", minHeight: "500px", backgroundColor: "#e2e8f0" }}>
      <MapContainer
        center={[9.082, 8.6753]}
        zoom={6}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}

        {incidents.map((incident) => {
          if (!incident.lat || !incident.lng) {
            console.warn("Skipping incident with invalid coordinates:", incident);
            return null;
          }
          return (
            <Marker
              key={incident.id}
              position={[incident.lat, incident.lng]}
              icon={icons[incident.type] || new L.Icon.Default()}
            >
              <Popup>
                <strong>{incident.title}</strong>
                <p>{incident.description}</p>
                {incident.date && <p>Date: {new Date(incident.date).toLocaleString()}</p>}
                {incident.photo_url && (
                  <img
                    src={incident.photo_url}
                    alt={incident.title}
                    width={150}
                    className="mt-2 max-w-full h-auto rounded"
                  />
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}