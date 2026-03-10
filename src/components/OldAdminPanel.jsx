import { useEffect, useState } from "react";
import IncidentMap from "./IncidentMap";
import { getIncidents, updateIncidentStatus } from "../services/api";

export default function AdminPanel() {
  const [incidents, setIncidents] = useState([]);

  // Fetch all incidents from backend
  const fetchIncidents = async () => {
    try {
      const res = await getIncidents();
      setIncidents(res.data);
    } catch (err) {
      console.error("Failed to fetch incidents:", err);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // Approve or reject an incident
  const handleStatusChange = async (id, status) => {
    try {
      await updateIncidentStatus(id, { status }); // call API to update status
      fetchIncidents(); // refresh map/list
    } catch (err) {
      console.error("Failed to update incident:", err);
      alert("Could not update incident status.");
    }
  };

  return (
    <div className="p-4" style={{ height: "100vh", width: "100%" }}>
      <h1 className="text-xl font-bold mb-4">Admin Panel - Incident Management</h1>

      {/* Map showing all incidents */}
      <div style={{ height: "500px", marginBottom: "20px" }}>
        <IncidentMap incidents={incidents} />
      </div>

      {/* Incident list with approve/reject */}
      <h2 className="font-semibold mb-2">Incident Feed</h2>
      <div className="space-y-2">
        {incidents.map((incident) => (
          <div key={incident.id} className="p-2 border rounded flex justify-between items-center">
            <div>
              <strong>{incident.title}</strong>
              <p>{incident.description}</p>
              <p className="text-sm font-semibold">Type: {incident.type}</p>
              <p className="text-sm">Status: {incident.status || "Pending"}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusChange(incident.id, "Approved")}
                className="p-1 bg-green-500 text-white rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusChange(incident.id, "Rejected")}
                className="p-1 bg-red-500 text-white rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}