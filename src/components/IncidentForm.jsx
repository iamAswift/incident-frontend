// src/components/IncidentForm.jsx
import React, { useState } from "react";

export default function IncidentForm() {
  const [estate, setEstate] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  const submitIncident = () => {
    if (!estate || !type || !description) return;
    alert(`Incident reported for ${estate}: ${type}`);
    setEstate("");
    setType("");
    setDescription("");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Report Incident</h2>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Estate"
          value={estate}
          onChange={(e) => setEstate(e.target.value)}
          className="border px-2 py-1 mr-2 rounded"
        />
      </div>
      <div className="mb-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border px-2 py-1 mr-2 rounded"
        >
          <option value="">Select Type</option>
          <option value="Security Breach">Security Breach</option>
          <option value="Theft/vandalism">Theft/vandalism</option>
          <option value="Fire Incident">Fire Incident</option>
          <option value="Medical Emergency">Medical Emergency</option>
          <option value="Suspicious Activity">Suspicious Activity</option>
          <option value="Noise">Noise</option>
          <option value="Illegal Gathering">Illegal Gathering</option>
        </select>
      </div>
      <div className="mb-2">
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border px-2 py-1 mr-2 rounded w-full"
        />
      </div>
      <button
        onClick={submitIncident}
        className="bg-yellow-500 text-white px-3 py-1 rounded"
      >
        Submit
      </button>
    </div>
  );
}