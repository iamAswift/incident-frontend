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

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateReportStatus(id, status);
      fetchReports(); // refresh after update
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  useEffect(() => {
    if (estateId) fetchReports();
  }, [estateId, fetchReports]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">
        🏢 Manager Dashboard
      </h2>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">
          Estate #{estateId} Reports
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
                  <span className="text-xs bg-yellow-400 px-2 py-1 rounded">
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