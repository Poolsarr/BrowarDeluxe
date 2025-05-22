import React, { useEffect, useState } from "react";
import { getRecipes } from "../api/recipes";
import RecipeItem from "../components/RecipeItem";

const Home = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const data = await getRecipes();
      setRecipes(data);
    } catch (err) {
      console.error("Błąd ładowania:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Przepisy WIP</h1>
      <ul>
        {recipes.map((recipe) => (
          <RecipeItem key={recipe._id} recipe={recipe} />
        ))}
      </ul>
    </div>
  );
};

export default Home;
