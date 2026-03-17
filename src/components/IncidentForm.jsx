import React, { useState, useEffect } from "react";
import { getEstates, createReport } from "../services/api";

export default function IncidentForm() {
  const [estates, setEstates] = useState([]);
  const [estateId, setEstateId] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch estates from backend
  useEffect(() => {
    const fetchEstates = async () => {
      try {
        const res = await getEstates();
        setEstates(res.data);
      } catch (err) {
        console.error("Error fetching estates:", err);
      }
    };
    fetchEstates();
  }, []);

  const submitReport = async () => {
    if (!estateId || !type || !description) return alert("Please fill all fields");

    setLoading(true);

    try {
      await createReport({ estate_id: estateId, type, description });
      setSuccess(true);
      setEstateId("");
      setType("");
      setDescription("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error submitting report:", err);
      alert("Failed to submit report. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Report Incident</h2>

      {success && (
        <div className="bg-green-500 text-white p-2 rounded mb-4 text-center">
          ✅ Report submitted successfully!
        </div>
      )}

      <div className="mb-2">
        <select
          value={estateId}
          onChange={(e) => setEstateId(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        >
          <option value="">Select Estate</option>
          {estates.map((e) => (
            <option key={e.id} value={e.id}>{e.estate_name}</option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        >
          <option value="">Select Type</option>
          <option value="Security Breach">Security Breach</option>
          <option value="Theft/Vandalism">Theft/Vandalism</option>
          <option value="Fire Incident">Fire Incident</option>
          <option value="Medical Emergency">Medical Emergency</option>
          <option value="Suspicious Activity">Suspicious Activity</option>
          <option value="Noise">Noise</option>
          <option value="Illegal Gathering">Illegal Gathering</option>
        </select>
      </div>

      <div className="mb-2">
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      <button
        onClick={submitReport}
        className={`w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Report"}
      </button>
    </div>
  );
}