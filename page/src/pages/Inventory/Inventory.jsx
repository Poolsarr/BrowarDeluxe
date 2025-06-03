// src/components/Inventory/Inventory.jsx
import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import InventoryForm from "./InventoryForm";
import InventoryTable from "./InventoryTable";
import { fetchInventory, deleteInventoryItem } from "./InventoryService";
import { motion } from "framer-motion"; // <--- dodane

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

  const loadInventory = async () => {
    try {
      const data = await fetchInventory();
      setItems(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Nie udało się pobrać danych z magazynu.");
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleEdit = (item) => {
    setForm({
      item: item.item,
      type: item.type,
      quantity:
        typeof item.quantity === "object" && item.quantity.$numberInt
          ? item.quantity.$numberInt
          : item.quantity,
      unit: item.unit,
      location: item.location,
    });
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Na pewno usunąć ten zasób?")) return;
    try {
      await deleteInventoryItem(id);
      await loadInventory();
    } catch (err) {
      console.error(err);
      alert("Nie udało się usunąć zasobu");
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
            Magazyn
          </Typography>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Typography color="error" variant="body1" gutterBottom>
              {error}
            </Typography>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <InventoryForm
            form={form}
            setForm={setForm}
            editingId={editingId}
            setEditingId={setEditingId}
            fetchInventory={loadInventory}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <InventoryTable
            items={items}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default Inventory;
