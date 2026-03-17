import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getReports, updateReportStatus } from "../services/api";

export default function ManagerDashboard() {
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

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateReportStatus(id, status);
      fetchReports();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // 🔥 Derived stats
  const pending = reports.filter(r => r.status === "reported");
  const approved = reports.filter(r => r.status === "approved");
  const rejected = reports.filter(r => r.status === "rejected");

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* 🔥 HEADER */}
      <h2 className="text-3xl font-bold mb-6">
        🏢 Estate Manager Dashboard
      </h2>

      {/* 📊 SUMMARY CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-yellow-100 p-4 rounded-xl">
          <h4 className="text-sm text-gray-600">Pending</h4>
          <p className="text-2xl font-bold">{pending.length}</p>
        </div>

        <div className="bg-green-100 p-4 rounded-xl">
          <h4 className="text-sm text-gray-600">Approved</h4>
          <p className="text-2xl font-bold">{approved.length}</p>
        </div>

        <div className="bg-red-100 p-4 rounded-xl">
          <h4 className="text-sm text-gray-600">Rejected</h4>
          <p className="text-2xl font-bold">{rejected.length}</p>
        </div>

      </div>

      {/* 🏢 ESTATE INFO (placeholder for now) */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h3 className="font-semibold text-lg">
          Estate #{estateId}
        </h3>
        <p className="text-gray-500 text-sm">
          Address: (connect from backend)
        </p>
        <p className="text-gray-500 text-sm">
          Security Officer: (connect from backend)
        </p>
      </div>

      {/* 🚨 REPORTS SECTION */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h3 className="text-xl font-semibold mb-4">
          All Reports
        </h3>

        {reports.length === 0 ? (
          <p className="text-gray-500">No reports available.</p>
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

                <p className="text-gray-600 mt-2">
                  {r.description}
                </p>

                <div className="flex justify-between items-center mt-3">

                  <span className="text-xs px-2 py-1 rounded bg-gray-200">
                    {r.status}
                  </span>

                  <div className="space-x-2">

                    <button
                      onClick={() => handleStatusUpdate(r.id, "approved")}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleStatusUpdate(r.id, "rejected")}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>

                  </div>

                </div>

              </li>
            ))}
          </ul>
        )}

      </div>

    </div>
  );
}