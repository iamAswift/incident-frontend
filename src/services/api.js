import axios from 'axios';

const API = axios.create({
  baseURL: "https://incident-backend-8yb5.onrender.com",
});

// ===== User Auth =====
export const registerUser = (data) => API.post("/users/register", data);
export const loginUser = (data) => API.post("/users/login", data);

// ===== Estates =====
export const getEstates = () => API.get("/estates"); // returns array of Estate objects
export const createEstate = (data) => {
  return API.post("/estates", data, {
    headers: { "Content-Type": "application/json" },
  });
};

// ===== Security Officers =====
export const getSecurityOfficers = (estateId) =>
  API.get(`/security_officers?estate_id=${estateId}`);
export const createSecurity = (data) => {
  return API.post("/security_officers", data, {
    headers: { "Content-Type": "application/json" },
  });
};

// ===== Reports =====
export const getReports = (estateId) =>
  API.get(`/reports?estate_id=${estateId}`);
export const createReport = (data) =>
  API.post("/reports", data, {
    headers: { "Content-Type": "application/json" },
  });
export const updateReportStatus = (reportId, status) =>
  API.patch(`/reports/${reportId}/status`, { status });

// ===== Incidents =====
export const getIncidents = () => API.get("/incidents");
export const updateIncidentStatus = (id, data) =>
  API.patch(`/incidents/${id}/status`, data);
export const createIncident = (data) =>
  API.post("/incidents", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });