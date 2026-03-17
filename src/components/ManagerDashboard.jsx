import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getReports,
  updateReportStatus,
  getEstates,
  getSecurityOfficers,
} from "../services/api";

export default function ManagerDashboard() {
  const [searchParams] = useSearchParams();
  const estateId = searchParams.get("estateId");

  const [reports, setReports] = useState([]);
  const [estate, setEstate] = useState(null);
  const [officers, setOfficers] = useState([]);

  // 🔥 FETCH REPORTS
  const fetchReports = useCallback(async () => {
    try {
      const res = await getReports(estateId);
      setReports(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [estateId]);

  // 🔥 FETCH ESTATE FROM LIST
  const fetchEstate = useCallback(async () => {
    try {
      const res = await getEstates();
      const found = res.data.find(e => String(e.id) === String(estateId));
      setEstate(found);
    } catch (err) {
      console.error(err);
    }
  }, [estateId]);

  // 🔥 FETCH SECURITY OFFICERS
  const fetchOfficers = useCallback(async () => {
    try {
      const res = await getSecurityOfficers(estateId);
      setOfficers(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [estateId]);

  useEffect(() => {
    if (estateId) {
      fetchReports();
      fetchEstate();
      fetchOfficers();
    }
  }, [estateId, fetchReports, fetchEstate, fetchOfficers]);

  // 🔥 UPDATE REPORT STATUS
  const handleStatusUpdate = async (id, status) => {
    try {
      await updateReportStatus(id, status);
      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 STATS
  const pending = reports.filter(r => r.status === "reported");
  const approved = reports.filter(r => r.status === "approved");
  const rejected = reports.filter(r => r.status === "rejected");

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <h2 className="text-3xl font-bold mb-6">
        🏢 Estate Manager Dashboard
      </h2>

      {/* 📊 STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-yellow-100 p-4 rounded-xl">
          <h4>Pending</h4>
          <p className="text-2xl">{pending.length}</p>
        </div>

        <div className="bg-green-100 p-4 rounded-xl">
          <h4>Approved</h4>
          <p className="text-2xl">{approved.length}</p>
        </div>

        <div className="bg-red-100 p-4 rounded-xl">
          <h4>Rejected</h4>
          <p className="text-2xl">{rejected.length}</p>
        </div>

      </div>

      {/* 🏢 ESTATE INFO */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">

        <h3 className="font-semibold text-lg">
          {estate?.estate_name || `Estate #${estateId}`}
        </h3>

        <p className="text-gray-500 text-sm">
          Address: {estate?.address || "N/A"}
        </p>

        <p className="text-gray-500 text-sm">
          Security Officers:
          {officers.length === 0
            ? " Not assigned"
            : officers.map(o => ` ${o.name}`).join(", ")}
        </p>

      </div>

      {/* 🚨 REPORTS */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h3 className="text-xl font-semibold mb-4">
          All Reports
        </h3>

        {reports.length === 0 ? (
          <p>No reports available.</p>
        ) : (
          <ul className="space-y-4">

            {reports.map((r) => (
              <li key={r.id} className="border p-4 rounded-lg">

                <div className="flex justify-between">
                  <strong>{r.type}</strong>
                  <span>
                    {new Date(r.created_at).toLocaleString()}
                  </span>
                </div>

                <p className="mt-2">{r.description}</p>

                <div className="flex justify-between mt-3">

                  <span>{r.status}</span>

                  <div>
                    <button
                      onClick={() => handleStatusUpdate(r.id, "approved")}
                      className="bg-green-500 text-white px-2 py-1 mr-2"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleStatusUpdate(r.id, "rejected")}
                      className="bg-red-500 text-white px-2 py-1"
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