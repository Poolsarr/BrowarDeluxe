import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import React from "react";

const RecipeForm = ({ form, setForm, editingId, setEditingId, fetchRecipes }) => {
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

    let ingredientsParsed, processParsed;
    try {
      ingredientsParsed = JSON.parse(form.ingredients);
      processParsed = JSON.parse(form.process);
    } catch {
      alert("Składniki i proces muszą być poprawnym JSON-em.");
      return;
    }

    const payload = {
      ...(editingId ? {} : { _id: form._id }),
      name: form.name.trim(),
      style: form.style.trim(),
      ingredients: ingredientsParsed,
      process: processParsed,
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
      setForm({ _id: "", name: "", style: "", ingredients: "", process: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Błąd zapisu receptury:", err);
      alert(err.message);
    }
  };

  return (
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
            label="Składniki (JSON)"
            fullWidth
            multiline
            minRows={3}
            value={form.ingredients}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="process"
            label="Proces (JSON)"
            fullWidth
            multiline
            minRows={3}
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
  );
};

export default RecipeForm;
