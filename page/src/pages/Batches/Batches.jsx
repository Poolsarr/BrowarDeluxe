// src/components/Batches/Batches.jsx
import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import BatchForm from "./BatchForm";
import BatchesTable from "./BatchesTable";
import { fetchBatches, deleteBatch } from "./BatchService";
import BatchStatusChart from './BatchStatusChart';
import { motion } from "framer-motion"; // <-- dodane

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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            Partie Produkcyjne
          </Typography>
        </motion.div>

        {/* Wykres statusów partii */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Box sx={{ my: 4 }}>
            <BatchStatusChart batches={batches} />
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <BatchForm
            form={form}
            setForm={setForm}
            editingId={editingId}
            setEditingId={setEditingId}
            fetchBatches={loadBatches}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <BatchesTable
            batches={batches}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default Batches;
