import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Fix default marker icons */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

/* Handle map clicks */
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick({
          lat: e.latlng.lat,
          lng: e.latlng.lng
        });
      }
    }
  });
  return null;
}

export default function IncidentMap({ incidents = [], onMapClick }) {
  return (
    <MapContainer
      center={[9.082, 8.6753]}
      zoom={6}
      style={{ height: "100%", width: "100vh" }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onMapClick={onMapClick} />

      {incidents.map((incident) => (
        <Marker key={incident.id} position={[incident.lat, incident.lng]}>
          <Popup>
            <strong>{incident.title}</strong>

            <p>{incident.description}</p>

            {incident.date && (
              <p>{new Date(incident.date).toLocaleString()}</p>
            )}

            {incident.photo_filename && (
              <img
                src={`http://localhost:8000/uploads/${incident.photo_filename}`}
                alt="incident"
                width="150"
              />
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}