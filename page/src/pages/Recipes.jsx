import React, { useEffect, useState } from "react";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState({
    _id: "",
    name: "",
    style: "",
    ingredients: "",
    process: "",
  });
  const [editingId, setEditingId] = useState(null);

  const fetchRecipes = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/recipes", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        if (!res.ok) {
        throw new Error("Błąd autoryzacji lub serwera");
        }

        const data = await res.json();
        if (Array.isArray(data)) {
            setRecipes(data);
        } else {
            setRecipes([]); // fallback na pustą tablicę
        }
    } catch (err) {
        console.error("Błąd pobierania receptur:", err);
        setRecipes([]); // fallback na pustą tablicę
    }
    };


  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { _id, name, style, ingredients, process } = form;
    const token = localStorage.getItem("token");

    if (!name || !style || !ingredients || !process) {
      alert("Uzupełnij wszystkie pola");
      return;
    }

    if (!editingId && !/^\d{5}$/.test(_id)) {
      alert("ID musi składać się z 5 cyfr");
      return;
    }

    const payload = {
      ...(editingId ? {} : { _id }),
      name,
      style,
      ingredients,
      process,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const url = editingId
      ? `http://localhost:5000/recipes/${editingId}`
      : "http://localhost:5000/recipes";
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

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Błąd zapisu");
      }

      await fetchRecipes();
      setForm({ _id: "", name: "", style: "", ingredients: "", process: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Błąd zapisu receptury:", err);
      alert(err.message);
    }
  };

  const handleEdit = (r) => {
    setForm({
      _id: r._id,
      name: r.name,
      style: r.style,
      ingredients: r.ingredients,
      process: r.process,
    });
    setEditingId(r._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Na pewno usunąć recepturę?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/recipes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Błąd usuwania");

      await fetchRecipes();
    } catch (err) {
      console.error(err);
      alert("Nie udało się usunąć receptury");
    }
  };

  const formatIngredients = (ingredients) => { // zchatowane, bo nie chcialo wyswietlac
    if (Array.isArray(ingredients)) {
      return ingredients.map((i) =>
        typeof i === "object" && i !== null
          ? `${i.name} (${i.quantity} ${i.type})`
          : i
      ).join(", ");
    }
    return ingredients;
  };

  const formatProcess = (process) => { // takze zchatowane
    if (typeof process === "object" && process !== null) {
        return Object.entries(process)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
    }
    return process;
    };


  return (
    <div style={{ padding: "20px" }}>
      <h2>Receptury</h2>

      <h3>{editingId ? "Edytuj recepturę" : "Dodaj recepturę"}</h3>
      <div style={{ marginBottom: "10px" }}>
        {!editingId && (
          <input
            name="_id"
            placeholder="ID (5 cyfr)"
            value={form._id}
            onChange={handleChange}
          />
        )}
        <input name="name" placeholder="Nazwa" value={form.name} onChange={handleChange} />
        <input name="style" placeholder="Styl" value={form.style} onChange={handleChange} />
        <textarea name="ingredients" placeholder="Składniki" value={form.ingredients} onChange={handleChange} />
        <textarea name="process" placeholder="Proces" value={form.process} onChange={handleChange} />
        <button onClick={handleSave}>{editingId ? "Zapisz zmiany" : "Dodaj recepturę"}</button>
      </div>

      <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nazwa</th>
            <th>Styl</th>
            <th>Składniki</th>
            <th>Proces</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((r) => (
            <tr key={r._id}>
            <td>{r._id}</td>
            <td>{r.name}</td>
            <td>{r.style}</td>
            <td>{formatIngredients(r.ingredients)}</td>
            <td>{formatProcess(r.process)}</td>
            <td>
                <button onClick={() => handleEdit(r)}>Edytuj</button>
                <button onClick={() => handleDelete(r._id)}>Usuń</button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recipes;
