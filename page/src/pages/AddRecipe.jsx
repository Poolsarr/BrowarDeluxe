import React, { useState, useRef } from "react";
import { addRecipe } from "../api/recipes";

const AddRecipe = () => {
  const [newRecipe, setNewRecipe] = useState("");
  const [message, setMessage] = useState("");
  const inputRef = useRef();

  const handleAdd = async () => {
    if (newRecipe.trim() === "") return;

    try {
      await addRecipe({ name: newRecipe });
      setMessage("✅ Przepis dodany!");
      setNewRecipe("");
      inputRef.current.focus();
    } catch (err) {
      setMessage("❌ Błąd dodawania przepisu");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dodaj nowy przepis</h2>
      <input
        ref={inputRef}
        value={newRecipe}
        onChange={(e) => setNewRecipe(e.target.value)}
        placeholder="Nazwa przepisu"
      />
      <button onClick={handleAdd}>Dodaj</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddRecipe;
