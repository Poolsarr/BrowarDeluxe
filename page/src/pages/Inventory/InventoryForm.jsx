import React from "react";
import { Paper, Typography, Grid, TextField, Button } from "@mui/material";

const InventoryForm = ({
  form,
  setForm,
  editingId,
  setEditingId,
  fetchInventory,
}) => {
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

    try {
      if (editingId) {
        await fetch(`http://localhost:5000/inventory/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("http://localhost:5000/inventory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        });
      }
      await fetchInventory();
      setForm({ item: "", type: "", quantity: "", unit: "", location: "" });
      setEditingId(null);
    } catch (err) {
      alert("Nie udało się zapisać zasobu");
      console.error(err);
    }
  };

  return (
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
  );
};

export default InventoryForm;
