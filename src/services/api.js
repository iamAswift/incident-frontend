import axios from 'axios';

const API = axios.create({
  baseURL: "https://incident-backend-8yb5.onrender.com",
});

// User auth
export const registerUser = (data) => API.post("/users/register", data);
export const loginUser = (data) => API.post("/users/login", data);



// ===== Estates =====
export const getEstates = () => API.get("/estates"); // returns array of Estate objects

// ===== Security Officers =====
export const getSecurityOfficers = (estateId) => API.get(`/security_officers?estate_id=${estateId}`);

// ===== Reports =====
export const getReports = (estateId) => API.get(`/reports?estate_id=${estateId}`);
export const createReport = (data) => {
  return API.post("/reports", data, {
    headers: { "Content-Type": "application/json" },
  });
};
export const updateReportStatus = (reportId, status) => {
  return API.patch(`/reports/${reportId}/status`, { status });
};

// Incidents
export const getIncidents = () => API.get("/incidents");

// Update incident status (approve/reject)
export const updateIncidentStatus = (id, data) => API.patch(`/incidents/${id}/status`, data);

// Incident creation with optional photo (FormData)
export const createIncident = (data) => {
  return API.post("/incidents", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};