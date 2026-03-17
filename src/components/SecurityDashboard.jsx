import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getReports } from "../services/api";

export default function SecurityDashboard() {
  const [searchParams] = useSearchParams();
  const estateId = searchParams.get("estateId");

  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {
      const res = await getReports(estateId);
      setReports(res.data); // data from your backend
    } catch (err) {
      console.error("Failed to fetch reports", err);
    }
  };

  useEffect(() => {
    if (estateId) fetchReports();
  }, [estateId]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">🔒 Security Dashboard</h2>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">
          Incidents for Estate #{estateId}
        </h3>

        {reports.length === 0 ? (
          <p className="text-gray-500">No incidents reported yet.</p>
        ) : (
          <ul className="space-y-4">
            {reports.map((r) => (
              <li key={r.id} className="border p-4 rounded-lg">
                <div className="flex justify-between">
                  <strong>{r.type}</strong>
                  <span className="text-sm text-gray-500">
                    {new Date(r.created_at).toLocaleString()}
                  </span>
                </div>

                <p className="text-gray-600 mt-2">{r.description}</p>

                <span className="text-xs bg-yellow-400 px-2 py-1 rounded">
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}