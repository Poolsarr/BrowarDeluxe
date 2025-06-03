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
  const navigate = useNavigate();

  const fetchBatches = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/batches", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setBatches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Błąd pobierania partii:", err);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toDatetimeLocal = (str) => {
    if (!str) return "";
    return str.slice(0, 16);
  };

  const handleEdit = (b) => {
    setForm({
      _id: b._id || "",
      recipeId: b.recipeId || "",
      startDate: toDatetimeLocal(b.startDate),
      endDate: toDatetimeLocal(b.endDate),
      status: b.status || "",
      volume: b.volume !== undefined ? String(b.volume) : "",
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

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const volumeAsNumber = parseFloat(form.volume);
    const isValidId = /^\d{5}$/.test(form._id);

    if (
      (!editingId && !isValidId) ||
      !form.recipeId.trim() ||
      !form.startDate ||
      !form.status.trim() ||
      isNaN(volumeAsNumber)
    ) {
      alert("Uzupełnij poprawnie wszystkie wymagane pola");
      return;
    }

    if (form.endDate && form.startDate > form.endDate) {
      alert("Data zakończenia nie może być przed rozpoczęciem");
      return;
    }

    const payload = {
      ...(editingId ? {} : { _id: form._id }),
      recipeId: form.recipeId.trim(),
      startDate: form.startDate,
      endDate: form.endDate || null,
      status: form.status.trim(),
      volume: volumeAsNumber,
      notes: form.notes.trim(),
      updatedAt: new Date().toISOString(),
      ...(editingId ? {} : { createdAt: new Date().toISOString() }),
    };

    try {
      const url = editingId
        ? `http://localhost:5000/batches/${editingId}`
        : "http://localhost:5000/batches";
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

  const columns = [
    { field: "_id", headerName: "ID", width: 100 },
    { field: "recipeId", headerName: "Receptura", width: 130 },
    {
      field: "startDate",
      headerName: "Start",
      width: 160,
      renderCell: (p) => p.value?.slice(0, 16).replace("T", " "),
    },
    {
      field: "endDate",
      headerName: "Koniec",
      width: 160,
      renderCell: (p) =>
        p.value ? p.value.slice(0, 16).replace("T", " ") : "-",
    },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "volume",
      headerName: "Objętość (L)",
      width: 120,
      type: "number",
    },
    { field: "notes", headerName: "Notatki", width: 440 },
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
        Partie Produkcyjne
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {editingId ? "Edytuj partię" : "Dodaj partię"}
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
          <Grid item xs={12} sm={2}>
            <TextField
              name="recipeId"
              label="ID Receptury"
              fullWidth
              value={form.recipeId}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="startDate"
              label="Data rozpoczęcia"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.startDate || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="endDate"
              label="Data zakończenia"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.endDate || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              name="status"
              label="Status"
              fullWidth
              value={form.status}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              name="volume"
              label="Objętość (L)"
              type="number"
              fullWidth
              value={form.volume}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="notes"
              label="Notatki"
              fullWidth
              multiline
              minRows={2}
              value={form.notes}
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
              {editingId ? "Zapisz zmiany" : "Dodaj partię"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ height: 400 }}>
        <DataGrid
          rows={batches}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
        />
      </Paper>
    </Container>
  );
};

export default Batches;
