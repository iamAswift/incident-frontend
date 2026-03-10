// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./components/AdminPanel";
import IncidentForm from "./components/IncidentForm";
import IncidentMap from "./components/IncidentMap";
import IncidentCard from "./components/IncidentCard";
import { getIncidents } from "./services/api";

function UserDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Fetch incidents from backend
  const fetchIncidents = async () => {
    try {
      const res = await getIncidents();
      setIncidents(res.data);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    }
  };

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4" style={{ height: "100vh", width: "100%" }}>
      <h1 className="text-xl font-bold mb-4">Incident Reporting</h1>

      {/* Incident submission form */}
      <IncidentForm
        location={selectedLocation}      // Auto-fill lat/lng
        onSubmitSuccess={fetchIncidents} // Refresh incidents after submit
      />

      {/* Map */}
      <div style={{ height: "500px", marginBottom: "20px" }}>
        <IncidentMap
          incidents={incidents}           // Existing incidents
          onMapClick={setSelectedLocation} // Update selectedLocation on click
        />
      </div>

      {/* Incident feed */}
      <h2 className="mt-6 font-semibold">Incident Feed</h2>
      {incidents.map((incident) => (
        <IncidentCard key={incident.id} incident={incident} />
      ))}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminPanel />} /> {/* admin route */}
      </Routes>
    </Router>
  );
}

export default App;