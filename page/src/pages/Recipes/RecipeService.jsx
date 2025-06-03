// src/components/Recipes/RecipeService.js
const API_URL = "http://localhost:5000/recipes";

const getToken = () => localStorage.getItem("token");

export const fetchRecipes = async () => {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Błąd pobierania receptur");
  return res.json();
};

export const createRecipe = async (recipe) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(recipe),
  });
  if (!res.ok) throw new Error("Błąd tworzenia receptury");
};

export const updateRecipe = async (id, recipe) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(recipe),
  });
  if (!res.ok) throw new Error("Błąd aktualizacji receptury");
};

export const deleteRecipe = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Błąd usuwania receptury");
};
