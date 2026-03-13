// src/components/IncidentMap.jsx

import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom icons
const icons = {
  bandit: new L.Icon({
    iconUrl: "/icons8-marker-b-50.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),

  accident: new L.Icon({
    iconUrl: "/icons8-car-accident-50.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),

  robbery: new L.Icon({
    iconUrl: "/icons8-robbery-80.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),

  kidnapping: new L.Icon({
    iconUrl: "/icons8-hostage-64.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
};

// Handle map click
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      }
    },
  });

  return null;
}

// Address search control
function AddressSearch({ onLocationSelect }) {
  const map = useMap();

  React.useEffect(() => {
    const control = L.Control.geocoder({
      defaultMarkGeocode: false,
      placeholder: "Search for address...",
      position: "topright",
    })
      .on("markgeocode", function (e) {
        const latlng = e.geocode.center;
        map.setView(latlng, 16);

        if (onLocationSelect) {
          onLocationSelect({ lat: latlng.lat, lng: latlng.lng });
        }

        L.marker(latlng).addTo(map);
      })
      .addTo(map);

    return () => map.removeControl(control);
  }, [map, onLocationSelect]);

  return null;
}

export default function IncidentMap({
  incidents = [],
  onMapClick,
  onLocationSelect
}) {
  return (
    <div style={{ width: "100%", height: "500px", minHeight: "500px" }}>
      <MapContainer
        center={[9.082, 8.6753]}
        zoom={6}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Address Search */}
        {onLocationSelect && <AddressSearch onLocationSelect={onLocationSelect} />}

        {/* Map click */}
        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}

        {/* Incident markers */}
        {incidents.map((incident) => {
          if (!incident.lat || !incident.lng) return null;

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