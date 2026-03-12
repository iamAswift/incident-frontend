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
      {/* Title */}
      <h3 className="font-bold text-lg text-gray-900">{incident.title}</h3>

      {/* Description */}
      <p className="text-gray-700 mt-2">{incident.description}</p>

      {/* Photo */}
      {incident.photo_url && (
        <div className="mt-2 overflow-hidden rounded h-48">
          <img 
            src={incident.photo_url} 
            alt="incident" 
            className="w-full h-full object-cover" 
          />
        </div>

      )}

      {/* Timestamp */}
      <p className="text-sm text-gray-400 mt-1">
        {incident.created_at || incident.date || incident.timestamp
          ? new Date(
              incident.created_at || incident.date || incident.timestamp
            ).toLocaleString()
          : "Reported just now"}
          
      </p>
    </div>
  );
}