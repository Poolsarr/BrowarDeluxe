import React, { useEffect, useState } from "react";

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState(null);

  const fetchBatches = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/batches", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Błąd pobierania danych");
      }

      const data = await res.json();
      setBatches(data);
    } catch (err) {
      setError("Nie udało się pobrać batchy");
      console.error("Błąd ładowania:", err);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []); // pusty array = wywołaj raz po montowaniu komponentu

  return (
    <div>
      <h1>Lista Batchy</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {batches.map((batch) => (
          <li key={batch._id}>
            <strong>{batch.name}</strong> – Status: {batch.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Batches;
