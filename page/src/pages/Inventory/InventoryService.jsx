const API_URL = "http://localhost:5000/inventory";

const getToken = () => localStorage.getItem("token");

export const fetchInventory = async () => {
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Błąd pobierania danych");
  return res.json();
};

export const createInventoryItem = async (item) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Błąd zapisu zasobu");
};

export const updateInventoryItem = async (id, item) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Błąd zapisu zasobu");
};

export const deleteInventoryItem = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Błąd usuwania zasobu");
};
