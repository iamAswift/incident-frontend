import React, { useState, useEffect } from "react";
import { getEstates, createReport } from "../services/api";

export default function IncidentForm() {
  const [estates, setEstates] = useState([]);
  const [estateId, setEstateId] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchEstates = async () => {
      try {
        const res = await getEstates();
        setEstates(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEstates();
  }, []);

  const submitReport = async () => {
    if (!estateId || !type || !description)
      return alert("Please fill all fields");

    setLoading(true);

    try {
      await createReport({ estate_id: estateId, type, description });

      setSuccess(true);
      setEstateId("");
      setType("");
      setDescription("");

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">🚨 Report an Incident</h1>
        <p className="text-gray-500 text-sm">
          Help keep your estate safe by reporting issues instantly
        </p>
      </div>

      {/* SUCCESS */}
      {success && (
        <div className="bg-green-500 text-white p-3 rounded text-center">
          ✅ Report submitted successfully
        </div>
      )}

      {/* FORM */}
      <div className="bg-white p-5 rounded-xl shadow space-y-4">
        <select
          value={estateId}
          onChange={(e) => setEstateId(e.target.value)}
          className="w-full border p-3 rounded-lg"
        >
          <option value="">Select Estate</option>
          {estates.map((e) => (
            <option key={e.id} value={e.id}>
              {e.estate_name}
            </option>
          ))}
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border p-3 rounded-lg"
        >
          <option value="">Incident Type</option>
          <option value="Security Breach">🔐 Security Breach</option>
          <option value="Theft/Vandalism">🚔 Theft / Vandalism</option>
          <option value="Fire Incident">🔥 Fire</option>
          <option value="Medical Emergency">🚑 Medical</option>
          <option value="Suspicious Activity">👀 Suspicious Activity</option>
          <option value="Noise">🔊 Noise</option>
          <option value="Illegal Gathering">⚠️ Illegal Gathering</option>
        </select>

        <textarea
          placeholder="Describe what happened..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-3 rounded-lg"
          rows={4}
        />

        <button
          onClick={submitReport}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white ${
            loading
              ? "bg-gray-400"
              : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </div>
    </div>
  );
}