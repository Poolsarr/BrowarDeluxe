import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import RecipeForm from "./RecipeForm";
import RecipesTable from "./RecipesTable";
import { motion } from "framer-motion"; // <--- Dodano

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
        headers: { Authorization: `Bearer ${token}` },
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
            Receptury
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <RecipeForm
            form={form}
            setForm={setForm}
            editingId={editingId}
            setEditingId={setEditingId}
            fetchRecipes={fetchRecipes}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <RecipesTable
            recipes={recipes}
            handleEdit={(recipe) => {
              setForm({
                _id: recipe._id,
                name: recipe.name,
                style: recipe.style,
                ingredients: JSON.stringify(recipe.ingredients, null, 2),
                process: JSON.stringify(recipe.process, null, 2),
              });
              setEditingId(recipe._id);
            }}
            handleDelete={async (id) => {
              if (!window.confirm("Na pewno usunąć recepturę?")) return;
              try {
                const token = localStorage.getItem("token");
                const res = await fetch(`http://localhost:5000/recipes/${id}`, {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Błąd usuwania");
                await fetchRecipes();
              } catch (err) {
                console.error(err);
                alert("Nie udało się usunąć receptury");
              }
            }}
          />
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default Recipes;
