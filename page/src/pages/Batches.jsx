import React, { useEffect, useState } from "react";

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState({
    _id: "",
    recipeId: "",
    startDate: "",
    endDate: "",
    status: "",
    volume: "",
    notes: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchBatches = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/batches", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setBatches(data);
      } else {
        setBatches([]);  // fallback na pustą tablicę
      }

    } catch (err) {
      console.error("Błąd pobierania partii:", err);
      setBatches([]);  // fallback na pustą tablicę
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const {
      _id,
      recipeId,
      startDate,
      endDate,
      status,
      volume,
      notes,
    } = form;
    const token = localStorage.getItem("token");

    const trimmedForm = {
      recipeId: recipeId.trim(),
      startDate: startDate.trim(),
      status: status.trim(),
      volume: volume,
    };

    console.log({ recipeId, startDate, status, volume }); //debug


    if (!editingId && !/^\d{5}$/.test(_id)) {
      alert("ID musi składać się z 5 cyfr");
      return;
    }

    if (
      !trimmedForm.recipeId ||
      !trimmedForm.startDate ||
      !trimmedForm.status ||
      trimmedForm.volume === "" ||
      isNaN(Number(trimmedForm.volume))
    ) {
      alert("Uzupełnij wymagane pola");
      return;
    }

    const payload = {
      ...(editingId ? {} : { _id }),
      recipeId: trimmedForm.recipeId,
      startDate: trimmedForm.startDate,
      endDate: endDate || null,
      status: trimmedForm.status,
      volume: Number(trimmedForm.volume),
      notes: notes.trim(),
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const url = editingId
      ? `http://localhost:5000/batches/${editingId}`
      : "http://localhost:5000/batches";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Błąd zapisu");

      await fetchBatches();
      setForm({
        _id: "",
        recipeId: "",
        startDate: "",
        endDate: "",
        status: "",
        volume: "",
        notes: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error("Błąd zapisu partii:", err);
      alert(err.message);
    }
  };

  const handleEdit = (b) => {
    setForm({
      _id: b._id,
      recipeId: b.recipeId,
      startDate: b.startDate?.slice(0, 16),
      endDate: b.endDate?.slice(0, 16) || "",
      status: b.status,
      volume: b.volume,
      notes: b.notes || "",
    });
    setEditingId(b._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Na pewno usunąć partię?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/batches/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Błąd usuwania");

      await fetchBatches();
    } catch (err) {
      console.error(err);
      alert("Nie udało się usunąć partii");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Partie produkcyjne</h2>

      <h3>{editingId ? "Edytuj partię" : "Dodaj partię"}</h3>
      <div style={{ marginBottom: "10px" }}>
        {!editingId && (
          <input
            name="_id"
            placeholder="ID (5 cyfr)"
            value={form._id}
            onChange={handleChange}
          />
        )}
        <input
          name="recipeId"
          placeholder="ID Receptury"
          value={form.recipeId}
          onChange={handleChange}
          onBlur={() => setForm({ ...form, recipeId: form.recipeId.trim() })}
        />
        <input
          name="startDate"
          type="datetime-local"
          value={form.startDate}
          onChange={handleChange}
        />
        <input
          name="endDate"
          type="datetime-local"
          value={form.endDate}
          onChange={handleChange}
        />
        <input
          name="status"
          placeholder="Status"
          value={form.status}
          onChange={handleChange}
          onBlur={() => setForm({ ...form, status: form.status.trim() })}
        />
        <input
          name="volume"
          type="number"
          placeholder="Objętość (L)"
          value={form.volume}
          onChange={handleChange}
        />
        <textarea
          name="notes"
          placeholder="Notatki"
          value={form.notes}
          onChange={handleChange}
          onBlur={() => setForm({ ...form, notes: form.notes.trim() })}
        />
        <button onClick={handleSave}>
          {editingId ? "Zapisz zmiany" : "Dodaj partię"}
        </button>
      </div>

      <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Receptura</th>
            <th>Start</th>
            <th>Koniec</th>
            <th>Status</th>
            <th>Objętość</th>
            <th>Notatki</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((b) => (
            <tr key={b._id}>
              <td>{b._id}</td>
              <td>{b.recipeId}</td>
              <td>{b.startDate?.slice(0, 16).replace("T", " ")}</td>
              <td>{b.endDate ? b.endDate.slice(0, 16).replace("T", " ") : "-"}</td>
              <td>{b.status}</td>
              <td>{b.volume} L</td>
              <td>{b.notes}</td>
              <td>
                <button onClick={() => handleEdit(b)}>Edytuj</button>
                <button onClick={() => handleDelete(b._id)}>Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Batches;
