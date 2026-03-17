import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getReports,
  updateReportStatus,
  createEstate,
  createSecurity,
  getEstates,
  getSecurityOfficers,
} from "../services/api";

export default function ManagerDashboard() {
  const [searchParams] = useSearchParams();
  const estateIdParam = searchParams.get("estateId");

  // States
  const [reports, setReports] = useState([]);
  const [estates, setEstates] = useState([]);
  const [selectedEstateId, setSelectedEstateId] = useState(estateIdParam || "");
  const [securityOfficers, setSecurityOfficers] = useState([]);

  // Form states for creating estate
  const [estateName, setEstateName] = useState("");
  const [address, setAddress] = useState("");
  const [officerName, setOfficerName] = useState("");
  const [phone, setPhone] = useState("");

  // Fetch all estates
  const fetchEstates = useCallback(async () => {
    try {
      const res = await getEstates();
      setEstates(res.data);
    } catch (err) {
      console.error("Failed to fetch estates", err);
    }
  }, []);

  // Fetch reports for selected estate
  const fetchReports = useCallback(async () => {
    if (!selectedEstateId) return;
    try {
      const res = await getReports(selectedEstateId);
      setReports(res.data);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    }
  }, [selectedEstateId]);

  // Fetch security officers for selected estate
  const fetchSecurityOfficers = useCallback(async () => {
    if (!selectedEstateId) return;
    try {
      const res = await getSecurityOfficers(selectedEstateId);
      setSecurityOfficers(res.data);
    } catch (err) {
      console.error("Failed to fetch security officers", err);
    }
  }, [selectedEstateId]);

  // Initial load
  useEffect(() => {
    fetchEstates();
  }, [fetchEstates]);

  useEffect(() => {
    if (selectedEstateId) {
      fetchReports();
      fetchSecurityOfficers();
    }
  }, [selectedEstateId, fetchReports, fetchSecurityOfficers]);

  // Handle report status update
  const handleStatusUpdate = async (id, status) => {
    try {
      await updateReportStatus(id, status);
      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle estate + security creation
  const handleCreateEstate = async () => {
    try {
      const res = await createEstate({ estate_name: estateName, address });
      const newEstateId = res.data.id;

      if (officerName) {
        await createSecurity({
          estate_id: newEstateId,
          name: officerName,
          phone,
        });
      }

      alert("Estate + Security Created ✅");

      // Reset form
      setEstateName("");
      setAddress("");
      setOfficerName("");
      setPhone("");

      fetchEstates();
    } catch (err) {
      console.error(err);
      alert("Failed to create estate/security");
    }
  };

  // Stats
  const pending = reports.filter((r) => r.status === "reported");
  const approved = reports.filter((r) => r.status === "approved");
  const rejected = reports.filter((r) => r.status === "rejected");

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">🏢 Estate Manager Dashboard</h2>

      {/* ➕ Create Estate */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-xl font-semibold mb-4">Create Estate & Assign Security</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Estate Name"
            value={estateName}
            onChange={(e) => setEstateName(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            placeholder="Security Officer Name"
            value={officerName}
            onChange={(e) => setOfficerName(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={handleCreateEstate}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Estate
        </button>
      </div>

      {/* ➡️ Select Estate */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <label className="font-semibold mr-2">Select Estate:</label>
        <select
          value={selectedEstateId}
          onChange={(e) => setSelectedEstateId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">--Choose Estate--</option>
          {estates.map((e) => (
            <option key={e.id} value={e.id}>
              {e.estate_name}
            </option>
          ))}
        </select>
      </div>

      {/* 📊 Stats */}
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

      {/* 🏢 Estate Info */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        {selectedEstateId ? (
          <>
            <h3 className="font-semibold text-lg">
              {estates.find((e) => e.id === Number(selectedEstateId))?.estate_name}
            </h3>
            <p className="text-gray-500 text-sm">
              Address: {estates.find((e) => e.id === Number(selectedEstateId))?.address || "N/A"}
            </p>
            <p className="text-gray-500 text-sm">
              Security Officers:{" "}
              {securityOfficers.length > 0
                ? securityOfficers.map((o) => o.name).join(", ")
                : "Not assigned"}
            </p>
          </>
        ) : (
          <p>Select an estate to see details</p>
        )}
      </div>

      {/* 🚨 Reports */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">All Reports</h3>
        {reports.length === 0 ? (
          <p>No reports available.</p>
        ) : (
          <ul className="space-y-4">
            {reports.map((r) => (
              <li key={r.id} className="border p-4 rounded-lg">
                <div className="flex justify-between">
                  <strong>{r.type}</strong>
                  <span>{new Date(r.created_at).toLocaleString()}</span>
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