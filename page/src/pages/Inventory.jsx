import React, { useEffect, useState } from "react";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    item: "",
    type: "",
    quantity: "",
    unit: "",
    location: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const parseField = (value) => {
    if (value && typeof value === "object") {
      if ("$numberInt" in value) return parseInt(value.$numberInt);
      if ("$date" in value) return new Date(value.$date).toLocaleString();
    }
    return value;
  };

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/inventory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Błąd pobierania danych");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
      setError("Nie udało się pobrać danych z magazynu.");
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { item, type, quantity, unit, location } = form;
    if (!item || !type || !quantity || !unit || !location) {
      alert("Uzupełnij wszystkie pola");
      return;
    }

    const payload = {
      item,
      type,
      quantity: parseInt(quantity),
      unit,
      location,
      updatedAt: new Date().toISOString(),
    };

    const token = localStorage.getItem("token");
    const url = editingId
      ? `http://localhost:5000/inventory/${editingId}`
      : "http://localhost:5000/inventory";
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

      await fetchInventory();
      setForm({ item: "", type: "", quantity: "", unit: "", location: "" });
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Nie udało się zapisać zasobu");
    }
  };

  const handleEdit = (item) => {
    setForm({
      item: item.item,
      type: item.type,
      quantity: parseField(item.quantity),
      unit: item.unit,
      location: item.location,
    });
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Na pewno usunąć ten zasób?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/inventory/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Błąd usuwania");

      await fetchInventory();
    } catch (err) {
      console.error(err);
      alert("Nie udało się usunąć zasobu");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Magazyn</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>{editingId ? "Edytuj zasób" : "Dodaj zasób"}</h3>
      <div style={{ marginBottom: "10px" }}>
        <input name="item" placeholder="Nazwa" value={form.item} onChange={handleChange} />
        <input name="type" placeholder="Typ" value={form.type} onChange={handleChange} />
        <input name="quantity" placeholder="Ilość" type="number" value={form.quantity} onChange={handleChange} />
        <input name="unit" placeholder="Jednostka" value={form.unit} onChange={handleChange} />
        <input name="location" placeholder="Lokalizacja" value={form.location} onChange={handleChange} />
        <button onClick={handleSave}>{editingId ? "Zapisz zmiany" : "Dodaj"}</button>
      </div>

      <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Typ</th>
            <th>Ilość</th>
            <th>Jednostka</th>
            <th>Lokalizacja</th>
            <th>Aktualizacja</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {items.map((el) => (
            <tr key={el._id}>
              <td>{el.item}</td>
              <td>{el.type}</td>
              <td>{parseField(el.quantity)}</td>
              <td>{el.unit}</td>
              <td>{el.location}</td>
              <td>{parseField(el.updatedAt)}</td>
              <td>
                <button onClick={() => handleEdit(el)}>Edytuj</button>
                <button onClick={() => handleDelete(el._id)}>Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
