import axios from "axios";

const API_URL = "http://localhost:5000";

export const getRecipes = async () => {
  const res = await axios.get(`${API_URL}/recipes`);
  return res.data;
};

export const addRecipe = async (recipe) => {
  const res = await axios.post(`${API_URL}/recipes`, recipe);
  return res.data;
};
