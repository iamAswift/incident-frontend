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

// Address search control with visible search button
function AddressSearch({ onLocationSelect }) {
  const map = useMap();

  React.useEffect(() => {
    console.log("Address search mounted, map:", map);

    if (!map) {
      console.warn("Map not available for AddressSearch");
      return;
    }
    const control = L.Control.geocoder({
      defaultMarkGeocode: false,
      geocoder: L.Control.Geocoder.nominatim(),
      placeholder: "Search Abuja area to see streetMap (e.g lugbe)...",
      position: "topright",
    }).addTo(map);

    // Add a clickable search button
    const input = control.getContainer().querySelector("input");
    const btn = document.createElement("button");
    btn.innerHTML = "🔍";
    btn.title = "Search";
    btn.style.marginLeft = "4px";
    btn.style.padding = "2px 6px";
    btn.style.borderRadius = "4px";
    btn.style.border = "1px solid #ccc";

    btn.onclick = () => {
      const query = input.value;
      if (!query) return;
      console.log("searching for:", query);

      control.options.geocoder.geocode(query, (results) => {
        console.log("Geocode results:", results);
        if (!results || results.length === 0){
          console.log("No location found");
          return;
        } 
        const result = results[0];
        const latlng = result.center;

        console.log("location found:", latlng);

        if (result.bbox) {
          const [south, north, west, east] = result.bbox;
          map.fitBounds([
            [south, west],
            [north, east],
          ]);
        } else {
          map.setView(latlng, 15);
        }
        L.marker(latlng).addTo(map);
        if (onLocationSelect) onLocationSelect({ lat: latlng.lat, lng: latlng.lng });
      });
    };

    control.getContainer().appendChild(btn);

    // Handle Enter key
    input.addEventListener("keyup", (e) => {
      if (e.key === "Enter") btn.click();
    });

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
        center={[9.0765, 7.3986]} // Center on Nigeria
        zoom={12}
        maxBounds={[
          [8.4, 6.7], // Southwest 
          [9.7, 8.2], // Northeast
        ]}
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