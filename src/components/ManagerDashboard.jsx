// src/components/ManagerDashboard.jsx
import React, { useState } from "react";

export default function ManagerDashboard() {
  const [estates, setEstates] = useState([]);
  const [estateName, setEstateName] = useState("");
  const [address, setAddress] = useState("");

  const addEstate = () => {
    if (!estateName || !address) return;
    setEstates([...estates, { name: estateName, address, id: Date.now() }]);
    setEstateName("");
    setAddress("");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Manager Dashboard</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Estate Name"
          value={estateName}
          onChange={(e) => setEstateName(e.target.value)}
          className="border px-2 py-1 mr-2 rounded"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border px-2 py-1 mr-2 rounded"
        />
        <button
          onClick={addEstate}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Add Estate
        </button>
      </div>

      <h3 className="font-semibold">Registered Estates</h3>
      <ul>
        {estates.map((e) => (
          <li key={e.id} className="mb-1">
            {e.name} - {e.address}
          </li>
        ))}
      </ul>
    </div>
  );
}