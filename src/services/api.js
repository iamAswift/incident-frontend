import axios from 'axios';

const API = axios.create({
  baseURL: "https://incident-backend-8yb5.onrender.com",
});

// User auth
export const registerUser = (data) => API.post("/users/register", data);
export const loginUser = (data) => API.post("/users/login", data);

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