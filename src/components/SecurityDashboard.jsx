// src/components/SecurityDashboard.jsx
import React from "react";

export default function SecurityDashboard() {
  // Placeholder incident data
  const incidents = [
    { id: 1, estate: "Green Estate", type: "Robbery", status: "Pending" },
    { id: 2, estate: "Sunrise Estate", type: "Accident", status: "Resolved" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Security Dashboard</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border px-2 py-1">Estate</th>
            <th className="border px-2 py-1">Type</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((i) => (
            <tr key={i.id}>
              <td className="border px-2 py-1">{i.estate}</td>
              <td className="border px-2 py-1">{i.type}</td>
              <td className="border px-2 py-1">{i.status}</td>
              <td className="border px-2 py-1">
                <button className="bg-green-500 text-white px-2 py-1 rounded">
                  Mark Resolved
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}