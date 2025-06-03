import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/recipes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setRecipes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Błąd pobierania receptur:", err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (recipe) => {
    setForm({
      _id: recipe._id,
      name: recipe.name,
      style: recipe.style,
      ingredients: recipe.ingredients,
      process: recipe.process,
    });
    setEditingId(recipe._id);
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

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (
      (!editingId && !/^\d{5}$/.test(form._id)) ||
      !form.name.trim() ||
      !form.style.trim() ||
      !form.ingredients.trim() ||
      !form.process.trim()
    ) {
      alert("Uzupełnij poprawnie wszystkie wymagane pola");
      return;
    }

    const payload = {
      ...(editingId ? {} : { _id: form._id }),
      name: form.name.trim(),
      style: form.style.trim(),
      ingredients: form.ingredients.trim(),
      process: form.process.trim(),
      updatedAt: new Date().toISOString(),
      ...(editingId ? {} : { createdAt: new Date().toISOString() }),
    };

    try {
      const url = editingId
        ? `http://localhost:5000/recipes/${editingId}`
        : "http://localhost:5000/recipes";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Błąd zapisu");

      await fetchRecipes();
      setForm({
        _id: "",
        name: "",
        style: "",
        ingredients: "",
        process: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error("Błąd zapisu receptury:", err);
      alert(err.message);
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Nazwa", width: 180 },
    { field: "style", headerName: "Styl", width: 140 },
    {
      field: "ingredients",
      headerName: "Składniki",
      width: 250,
      renderCell: (p) =>
        Array.isArray(p.value)
          ? p.value.map((i) => `${i.name} (${i.quantity} ${i.type})`).join(", ")
          : String(p.value),
    },
    {
      field: "process",
      headerName: "Proces",
      width: 250,
      renderCell: (p) =>
        Array.isArray(p.value)
          ? p.value.map((i) => `${i.name} (${i.quantity} ${i.type})`).join(", ")
          : String(p.value),
    },
    {
      field: "updatedAt",
      headerName: "Ostatnia zmiana",
      width: 180,
      renderCell: (p) =>
        p.value ? p.value.slice(0, 16).replace("T", " ") : "-",
    },
    {
      field: "actions",
      headerName: "Akcje",
      width: 130,
      sortable: false,
      align: "right",
      headerAlign: "right",
      flex: 1,
      renderCell: (params) => (
        <>
          <Tooltip title="Edytuj">
            <IconButton onClick={() => handleEdit(params.row)} color="primary">
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Usuń">
            <IconButton
              onClick={() => handleDelete(params.row._id)}
              color="error"
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/")}
        >
          Powrót
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Receptury
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {editingId ? "Edytuj recepturę" : "Dodaj recepturę"}
        </Typography>
        <Grid container spacing={2}>
          {!editingId && (
            <Grid item xs={12} sm={2}>
              <TextField
                name="_id"
                label="ID (5 cyfr)"
                fullWidth
                value={form._id}
                onChange={handleChange}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={3}>
            <TextField
              name="name"
              label="Nazwa"
              fullWidth
              value={form.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              name="style"
              label="Styl"
              fullWidth
              value={form.style}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="ingredients"
              label="Składniki"
              fullWidth
              multiline
              minRows={2}
              value={form.ingredients}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="process"
              label="Proces"
              fullWidth
              multiline
              minRows={2}
              value={form.process}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ mt: 2 }}
            >
              {editingId ? "Zapisz zmiany" : "Dodaj recepturę"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ height: 400 }}>
        <DataGrid
          rows={recipes}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
        />
      </Paper>
    </Container>
  );
};

export default Recipes;
