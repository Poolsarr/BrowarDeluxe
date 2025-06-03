// src/components/Batches/Batches.jsx
import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import BatchForm from "./BatchForm";
import BatchesTable from "./BatchesTable";
import { fetchBatches, deleteBatch } from "./BatchService";

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

  const loadBatches = async () => {
    try {
      const data = await fetchBatches();
      setBatches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  const handleEdit = (b) => {
    setForm({
      _id: b._id || "",
      recipeId: b.recipeId || "",
      startDate: b.startDate ? b.startDate.slice(0, 16) : "",
      endDate: b.endDate ? b.endDate.slice(0, 16) : "",
      status: b.status || "",
      volume: b.volume !== undefined ? String(b.volume) : "",
      notes: b.notes || "",
    });
    setEditingId(b._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Na pewno usunąć partię?")) return;
    try {
      await deleteBatch(id);
      await loadBatches();
    } catch (err) {
      console.error(err);
      alert("Nie udało się usunąć partii");
    }
  };

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

      <BatchForm
        form={form}
        setForm={setForm}
        editingId={editingId}
        setEditingId={setEditingId}
        fetchBatches={loadBatches}
      />

      <BatchesTable
        batches={batches}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </Container>
  );
};

export default Batches;
