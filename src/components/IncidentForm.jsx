import { useState, useEffect } from "react";
import { createIncident } from "../services/api";

export default function IncidentForm({ location, onSubmitSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("bandit"); // default type
  const [photo, setPhoto] = useState(null);

  // Auto-fill lat/lng when user clicks map
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    if (location) {
      setLatitude(location.lat);
      setLongitude(location.lng);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !latitude || !longitude) {
      alert("Please fill in all fields and select a location on the map.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("lat", latitude);
    formData.append("lng", longitude);
    formData.append("type", type);
    formData.append("created_at", new Date().toISOString());
    if (photo) formData.append("photo", photo);

    // Debugging
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const res = await createIncident(formData);
      console.log("Incident submitted:", res.data);
      // Reset form
      setTitle("");
      setDescription("");
      setType("bandit");
      setLatitude("");
      setLongitude("");
      setPhoto(null);
      if (onSubmitSuccess) onSubmitSuccess();
      alert("Incident submitted!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit incident.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-2 border rounded shadow">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="block w-full mb-2 p-1 border rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="block w-full mb-2 p-1 border rounded"
        required
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="block w-full mb-2 p-1 border rounded"
      >
        <option value="bandit">Bandit Infestation</option>
        <option value="accident">Accident</option>
        <option value="robbery">Robbery</option>
        <option value="kidnapping">Kidnapping</option>
      </select>
      <div className="mb-2 flex gap-2">
        <input
          type="text"
          placeholder="Latitude"
          value={latitude}
          readOnly
          className="w-1/2 p-1 border rounded"
        />
        <input
          type="text"
          placeholder="Longitude"
          value={longitude}
          readOnly
          className="w-1/2 p-1 border rounded"
        />
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files[0])}
        className="mb-2"
      />

      <button
        type="submit"
        className="p-2 bg-blue-500 text-white rounded"
      >
        Submit Incident
      </button>
    </form>
  );
}