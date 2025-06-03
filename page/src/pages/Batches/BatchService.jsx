// src/components/Batches/BatchService.jsx
const API_URL = "http://localhost:5000/batches";

const getToken = () => localStorage.getItem("token");

export const fetchBatches = async () => {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Błąd pobierania partii");
  return res.json();
};

export const createBatch = async (batch) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(batch),
  });
  if (!res.ok) throw new Error("Błąd tworzenia partii");
};

export const updateBatch = async (id, batch) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(batch),
  });
  if (!res.ok) throw new Error("Błąd aktualizacji partii");
};

export const deleteBatch = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Błąd usuwania partii");
};
