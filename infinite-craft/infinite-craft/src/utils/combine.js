import { recipes } from "../data/recipes.js";

export function combine(a, b, genre = "nature") {
  const cleanA = a.trim();
  const cleanB = b.trim();

  // Infinite craft allows bidirectional combines
  const key1 = `${cleanA}+${cleanB}`;
  const key2 = `${cleanB}+${cleanA}`;

  console.log(`COMBINING [${genre}]:`, key1, "or", key2);

  const currentRecipes = recipes[genre] || {};
  
  return currentRecipes[key1] || currentRecipes[key2] || null;
}