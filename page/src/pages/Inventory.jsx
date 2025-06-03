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
  const navigate = useNavigate();

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Błąd pobierania danych");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
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

  const parseField = (value) => {
    if (value && typeof value === "object") {
      if ("$numberInt" in value) return parseInt(value.$numberInt);
      if ("$date" in value) return new Date(value.$date).toLocaleString();
    }
    return value;
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
      updatedAt: new Date().toISOString(), // <<< dodane
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

  const columns = [
    { field: "item", headerName: "Nazwa", width: 180 },
    { field: "type", headerName: "Typ", width: 140 },
    {
      field: "quantity",
      headerName: "Ilość",
      width: 100,
      type: "number",
      renderCell: (params) => parseField(params.row.quantity),
    },
    { field: "unit", headerName: "Jednostka", width: 100 },
    { field: "location", headerName: "Lokalizacja", width: 150 },
    {
      field: "updatedAt",
      headerName: "Aktualizacja",
      width: 400,
      renderCell: (params) =>
        params.row?.updatedAt ? parseField(params.row.updatedAt) : "-",
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
        Magazyn
      </Typography>

      {error && (
        <Typography color="error" variant="body1" gutterBottom>
          {error}
        </Typography>
      )}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {editingId ? "Edytuj zasób" : "Dodaj zasób"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={2}>
            <TextField
              name="item"
              label="Nazwa"
              fullWidth
              value={form.item}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              name="type"
              label="Typ"
              fullWidth
              value={form.type}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              name="quantity"
              label="Ilość"
              type="number"
              fullWidth
              value={form.quantity}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              name="unit"
              label="Jednostka"
              fullWidth
              value={form.unit}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="location"
              label="Lokalizacja"
              fullWidth
              value={form.location}
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
              {editingId ? "Zapisz zmiany" : "Dodaj zasób"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ height: 400 }}>
        <DataGrid
          rows={items}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
        />
      </Paper>
    </Container>
  );
};

export default Inventory;
