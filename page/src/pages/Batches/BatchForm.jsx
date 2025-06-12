import React from "react";
import { Paper, Typography, Grid, TextField, Button } from "@mui/material";

const BatchForm = ({
  form,
  setForm,
  editingId,
  setEditingId,
  fetchBatches,
}) => {
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toDatetimeLocal = (str) => {
    if (!str) return "";
    return str.slice(0, 16);
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

  return (
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
  );
};

export default BatchForm;
