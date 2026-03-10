import React from "react";

export default function IncidentCard({ incident, onClick }) {
  const handleClick = () => {
    if (onClick) {
      onClick(incident);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="p-4 mb-2 border rounded shadow cursor-pointer hover:bg-gray-50"
    >
      <h3 className="font-bold text-lg">{incident.title}</h3>

      <p className="text-gray-700">{incident.description}</p>

      {incident.photo_url && (
        <img src={incident.photo_url} alt="incident" className="mt-2 rounded" />
      )}

      <p className="text-sm text-gray-400 mt-1">
        {incident.created_at || incident.date || incident.timestamp
          ? new Date(
              incident.created_at || incident.date || incident.timestamp
            ).toLocaleString()
          : "Reported justnow"}
          
      </p>
    </div>
  );
}