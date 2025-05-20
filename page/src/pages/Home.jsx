import React, { useEffect, useState, useRef } from "react";
import { getRecipes, addRecipe } from "../api/recipes";
import RecipeItem from "../components/RecipeItem";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    loadRecipes();
  }, []);

  const [pingResponse, setPingResponse] = useState(""); //debug

  const handlePing = async () => {
    try {
      const res = await fetch("http://localhost:5000/");
      const text = await res.text();
      setPingResponse(`✅ Backend działa: ${text}`);
    } catch (err) {
      setPingResponse("❌ Błąd połączenia z backendem");
    }
  };


  const loadRecipes = async () => {
    try {
      const data = await getRecipes();
      setRecipes(data);
    } catch (err) {
      console.error("Błąd ładowania:", err);
    }
  };

  const handleAdd = async () => {
    if (newRecipe.trim() === "") return;
    await addRecipe({ name: newRecipe });
    setNewRecipe("");
    inputRef.current.focus();
    loadRecipes();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Przepisy</h1>

      <button onClick={handlePing} style={{ marginBottom: "10px" }}>
        Pinguj backend
      </button>
      <p>{pingResponse}</p>

      <input
        ref={inputRef}
        value={newRecipe}
        onChange={(e) => setNewRecipe(e.target.value)}
        placeholder="Nowy przepis"
      />
      <button onClick={handleAdd}>Dodaj</button>

      <ul>
        {recipes.map((recipe) => (
          <RecipeItem key={recipe._id} recipe={recipe} />
        ))}
      </ul>
    </div>
  );
};

export default Home;
