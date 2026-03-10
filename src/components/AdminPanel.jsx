import React, { useEffect, useState } from "react";

export default function AdminPanel() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/incidents")
      .then((res) => res.json())
      .then((data) => setIncidents(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Incident Dashboard</h1>

      {incidents.length === 0 && <p>No incidents reported.</p>}

      {incidents.map((incident) => (
        <div
          key={incident.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px"
          }}
        >
          <h3>{incident.title}</h3>

          <p>{incident.description}</p>

          <p>
            <strong>Location:</strong> {incident.lat}, {incident.lng}
          </p>

          {incident.created_at && (
            <p>
              <strong>Date:</strong>{" "}
              {new Date(incident.created_at).toLocaleString()}
            </p>
          )}

          {incident.photo_filename && (
            <img
              src={`http://localhost:8000/uploads/${incident.photo_filename}`}
              alt="incident"
              width="200"
            />
          )}
        </div>
      ))}
    </div>
  );
}