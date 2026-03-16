// src/components/ManagerDashboard.jsx
import React, { useState } from "react";

export default function ManagerDashboard() {
  const [estates, setEstates] = useState([]);
  const [estateName, setEstateName] = useState("");
  const [address, setAddress] = useState("");

  const addEstate = () => {
    if (!estateName || !address) return;
    setEstates((prev) => [...prev, { id: prev.length + 1, estateName, address }]);
    setEstateName(""); setAddress("");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center space-x-2">
        🏠 Manager Dashboard
      </h2>

      {/* Add Estate */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-2">Add Estate</h3>
        <input
          type="text"
          placeholder="Estate Name"
          value={estateName}
          onChange={(e) => setEstateName(e.target.value)}
          className="border px-2 py-1 mr-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border px-2 py-1 mr-2 rounded w-full mb-2"
        />
        <button
          onClick={addEstate}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          ➕ Add Estate
        </button>
      </div>

      {/* Registered Estates */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Registered Estates</h3>
        {estates.length === 0 ? (
          <p className="text-gray-500">No estates registered yet.</p>
        ) : (
          <ul className="space-y-2">
            {estates.map((e) => (
              <li key={e.id} className="border p-2 rounded flex justify-between items-center">
                <div>
                  <strong>{e.estateName}</strong> <br />
                  <small>{e.address}</small>
                </div>
                <span>📍</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}