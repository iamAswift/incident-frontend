import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getReports } from "../services/api";

export default function SecurityDashboard() {
  const [searchParams] = useSearchParams();
  const estateId = searchParams.get("estateId");

  const [reports, setReports] = useState([]);

  const fetchReports = useCallback(async () => {
    try {
      const res = await getReports(estateId);
      setReports(res.data);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    }
  }, [estateId]);

  useEffect(() => {
    if (estateId) fetchReports();
  }, [estateId, fetchReports]);

  const getStatusColor = (status) => {
    if (status === "approved") return "bg-green-500";
    if (status === "rejected") return "bg-red-500";
    return "bg-yellow-500";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">🔒 Security Operations</h1>
        <p className="text-gray-500">
          Monitor and respond to incidents in real-time
        </p>
      </div>

      {/* ESTATE INFO */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold">
          Estate ID: {estateId || "Not selected"}
        </h2>
        <p className="text-sm text-gray-500">
          Live incident feed for assigned estate
        </p>
      </div>

      {/* REPORTS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">🚨 Active Incidents</h2>

        {reports.length === 0 ? (
          <p className="text-gray-500">No incidents reported</p>
        ) : (
          <div className="space-y-4">
            {reports.map((r) => (
              <div key={r.id} className="border p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center">
                  <strong>{r.type}</strong>
                  <span className="text-sm text-gray-500">
                    {new Date(r.created_at).toLocaleString()}
                  </span>
                </div>

                <p className="mt-2 text-gray-600">{r.description}</p>

                <div className="mt-3 flex justify-between items-center">
                  <span
                    className={`text-white text-xs px-3 py-1 rounded ${getStatusColor(
                      r.status
                    )}`}
                  >
                    {r.status.toUpperCase()}
                  </span>

                  <span className="text-xs text-gray-400">
                    Incident ID: #{r.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}