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

  const [reports, setReports] = useState([]);
  const [estates, setEstates] = useState([]);
  const [selectedEstateId, setSelectedEstateId] = useState(estateIdParam || "");
  const [securityOfficers, setSecurityOfficers] = useState([]);

  const [estateName, setEstateName] = useState("");
  const [address, setAddress] = useState("");
  const [officerName, setOfficerName] = useState("");
  const [phone, setPhone] = useState("");

  // 👤 Simulated manager_id (later replace with auth user)
  const managerId = "550e8400-e29b-41d4-a716-446655440000";

  const fetchEstates = useCallback(async () => {
    try {
      const res = await getEstates();
      setEstates(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchReports = useCallback(async () => {
    if (!selectedEstateId) return;
    try {
      const res = await getReports(selectedEstateId);
      setReports(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [selectedEstateId]);

  const fetchSecurityOfficers = useCallback(async () => {
    if (!selectedEstateId) return;
    try {
      const res = await getSecurityOfficers(selectedEstateId);
      setSecurityOfficers(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [selectedEstateId]);

  useEffect(() => {
    fetchEstates();
  }, [fetchEstates]);

  useEffect(() => {
    if (selectedEstateId) {
      fetchReports();
      fetchSecurityOfficers();
    }
  }, [selectedEstateId, fetchReports, fetchSecurityOfficers]);

  const handleStatusUpdate = async (id, status) => {
    await updateReportStatus(id, status);
    fetchReports();
  };

  const handleCreateEstate = async () => {
    try {
      const res = await createEstate({
        estate_name: estateName,
        address,
        manager_id: managerId,
      });

      const newEstateId = res.data.id;

      if (officerName) {
        await createSecurity({
          estate_id: newEstateId,
          name: officerName,
          phone,
        });
      }

      alert("✅ Estate & Security Created");

      setEstateName("");
      setAddress("");
      setOfficerName("");
      setPhone("");

      fetchEstates();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create estate");
    }
  };

  const pending = reports.filter((r) => r.status === "reported");
  const approved = reports.filter((r) => r.status === "approved");
  const rejected = reports.filter((r) => r.status === "rejected");

  const selectedEstate = estates.find(
    (e) => e.id === Number(selectedEstateId)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">🏢 Estate Manager Dashboard</h1>
        <p className="text-gray-500">
          Monitor incidents, manage estates, and improve resident safety
        </p>
      </div>

      {/* CREATE ESTATE */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          ➕ Create Estate & Assign Security
        </h2>

        <div className="grid md:grid-cols-4 gap-4">
          <input
            placeholder="Estate Name"
            value={estateName}
            onChange={(e) => setEstateName(e.target.value)}
            className="border p-3 rounded-lg"
          />
          <input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-3 rounded-lg"
          />
          <input
            placeholder="Security Officer"
            value={officerName}
            onChange={(e) => setOfficerName(e.target.value)}
            className="border p-3 rounded-lg"
          />
          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-3 rounded-lg"
          />
        </div>

        <button
          onClick={handleCreateEstate}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Create Estate
        </button>
      </div>

      {/* SELECT ESTATE */}
      <div className="bg-white p-4 rounded-xl shadow">
        <select
          value={selectedEstateId}
          onChange={(e) => setSelectedEstateId(e.target.value)}
          className="w-full border p-3 rounded-lg"
        >
          <option value="">-- Select Estate --</option>
          {estates.map((e) => (
            <option key={e.id} value={e.id}>
              {e.estate_name}
            </option>
          ))}
        </select>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-yellow-100 p-5 rounded-xl shadow">
          <p className="text-sm text-gray-600">Pending Reports</p>
          <h2 className="text-3xl font-bold">{pending.length}</h2>
        </div>
        <div className="bg-green-100 p-5 rounded-xl shadow">
          <p className="text-sm text-gray-600">Approved</p>
          <h2 className="text-3xl font-bold">{approved.length}</h2>
        </div>
        <div className="bg-red-100 p-5 rounded-xl shadow">
          <p className="text-sm text-gray-600">Rejected</p>
          <h2 className="text-3xl font-bold">{rejected.length}</h2>
        </div>
      </div>

      {/* ESTATE DETAILS */}
      <div className="bg-white p-6 rounded-xl shadow">
        {selectedEstate ? (
          <>
            <h2 className="text-xl font-semibold">
              {selectedEstate.estate_name}
            </h2>
            <p className="text-gray-500">{selectedEstate.address}</p>

            <div className="mt-3">
              <strong>Security Team:</strong>{" "}
              {securityOfficers.length > 0
                ? securityOfficers.map((o) => o.name).join(", ")
                : "Not assigned"}
            </div>
          </>
        ) : (
          <p className="text-gray-500">
            Select an estate to view details
          </p>
        )}
      </div>

      {/* REPORTS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">🚨 Incident Reports</h2>

        {reports.length === 0 ? (
          <p className="text-gray-500">No reports available</p>
        ) : (
          <div className="space-y-4">
            {reports.map((r) => (
              <div key={r.id} className="border p-4 rounded-xl shadow-sm">
                <div className="flex justify-between">
                  <strong>{r.type}</strong>
                  <span className="text-sm text-gray-500">
                    {new Date(r.created_at).toLocaleString()}
                  </span>
                </div>

                <p className="mt-2">{r.description}</p>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm font-medium">{r.status}</span>

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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}