import React, { useState, useEffect } from "react";
import http from "../http";
import "../themes/Fridge.css";

const Fridge = () => {
  // State for fridge ingredients
  const [fridgeItems, setFridgeItems] = useState([]);
  // State for managing new ingredient input
  const [newItem, setNewItem] = useState({
    ingredientName: "",
    quantity: 0,
    unit: "",
    expiryDate: ""
  });
  // State for managing error messages
  const [error, setError] = useState("");
  // State for bookmarks (folders with recipes)
  const [bookmarks, setBookmarks] = useState([]);
  // State for bookmark cooking statuses
  const [bookmarkStatus, setBookmarkStatus] = useState({});

  // Fetch fridge items
  const fetchFridgeItems = async () => {
    try {
      const response = await http.get("/api/Fridge");
      setFridgeItems(response.data);
    } catch (err) {
      console.error("Error fetching fridge items:", err);
      setError("Failed to fetch fridge items.");
    }
  };

  // Fetch bookmarks grouped by folders
  const fetchBookmarks = async () => {
    try {
      const response = await http.get("/api/Bookmarks");
      setBookmarks(response.data);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      setError("Failed to fetch bookmarks.");
    }
  };

  useEffect(() => {
    fetchFridgeItems();
    fetchBookmarks();
  }, []);

  // Handle input change for adding ingredients
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value
    }));
  };

  // Add an ingredient to the fridge
  const handleAddItem = async (event) => {
    event.preventDefault();
  
    if (!newItem.ingredientName.trim() || newItem.quantity <= 0 || !newItem.unit.trim()) {
      setError("Please fill out all fields except expiry date.");
      return;
    }
  
    setError("");
    try {
      const payload = {
        ingredientName: newItem.ingredientName,
        quantity: newItem.quantity,
        unit: newItem.unit,
      };
  
      if (newItem.expiryDate.trim()) {
        payload.expiryDate = newItem.expiryDate;
      }
  
      const response = await http.post("/api/Fridge/add", payload);
      setFridgeItems((prev) => [...prev, response.data]);
  
      setNewItem({ ingredientName: "", quantity: 0, unit: "", expiryDate: "" });
    } catch (err) {
      console.error("Error adding fridge item:", err);
      setError("Failed to add new ingredient.");
    }
  };

  // Remove an ingredient from the fridge
  const handleRemoveItem = async (id) => {
    try {
      await http.delete(`/api/Fridge/remove/${id}`);
      setFridgeItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error removing fridge item:", err);
      setError("Failed to remove the ingredient.");
    }
  };

  // "Cook It!" functionality
  const cookRecipe = async (recipe) => {
    try {
      setBookmarkStatus((prev) => ({
        ...prev,
        [recipe.recipeId]: { message: "Checking ingredients...", missing: [] }
      }));

      const recipeRes = await http.get(`/api/Recipe/details/${recipe.recipeId}`);
      const recipeDetails = recipeRes.data;

      if (!recipeDetails || !recipeDetails.extendedIngredients) {
        setBookmarkStatus((prev) => ({
          ...prev,
          [recipe.recipeId]: { message: "Recipe details not available.", missing: [] }
        }));
        return;
      }

      const missingIngredients = recipeDetails.extendedIngredients.filter(
        (ingredient) =>
          !fridgeItems.some(
            (item) => item.ingredientName.toLowerCase() === ingredient.name.toLowerCase()
          )
      ).map((ingredient) => ingredient.name);

      if (missingIngredients.length > 0) {
        setBookmarkStatus((prev) => ({
          ...prev,
          [recipe.recipeId]: {
            message: "Missing ingredients.",
            missing: missingIngredients,
          },
        }));
        return;
      }

      setBookmarkStatus((prev) => ({
        ...prev,
        [recipe.recipeId]: { message: "Cooking...", missing: [] },
      }));

      alert(`Cooking Instructions:\n${recipeDetails.instructions || "No instructions provided."}`);

      for (let ingredient of recipeDetails.extendedIngredients) {
        const matchingItem = fridgeItems.find(
          (item) => item.ingredientName.toLowerCase() === ingredient.name.toLowerCase()
        );
        if (matchingItem && matchingItem.id) {
          await http.delete(`/api/Fridge/remove/${matchingItem.id}`);
        }
      }

      fetchFridgeItems();

      setBookmarkStatus((prev) => ({
        ...prev,
        [recipe.recipeId]: { message: "Cooking done!", missing: [] },
      }));
    } catch (error) {
      console.error("Error cooking recipe:", error);
      setBookmarkStatus((prev) => ({
        ...prev,
        [recipe.recipeId]: { message: "Error during cooking process.", missing: [] },
      }));
    }
  };

  return (
    <div className="fridge-container">
      <h2>My Fridge</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Form to add an ingredient */}
      <form className="fridge-form" onSubmit={handleAddItem}>
  <input
    type="text"
    placeholder="Ingredient Name"
    name="ingredientName"
    value={newItem.ingredientName}
    onChange={handleInputChange}
    required
  />
  <input
    type="number"
    placeholder="Quantity"
    name="quantity"
    value={newItem.quantity}
    onChange={handleInputChange}
    min="0"
    step="0.01"
    required
  />
  <input
    type="text"
    placeholder="Unit (e.g., g, ml, pcs)"
    name="unit"
    value={newItem.unit}
    onChange={handleInputChange}
    required
  />
  <input
    type="date"
    name="expiryDate"
    value={newItem.expiryDate}
    onChange={handleInputChange}
  />
  <button type="submit">Add Ingredient</button>
</form>

      {/* List of fridge items */}
      <ul className="fridge-list">
        {fridgeItems.map((item) => (
          <li key={item.id}>
            {`${item.ingredientName}, ${item.quantity} ${item.unit}, Expiry: ${item.expiryDate}`}
            <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>

      {/* Bookmarked Recipes */}
      <h2>Bookmarked Recipes</h2>
      {bookmarks.length === 0 ? (
        <p>You have no bookmarks.</p>
      ) : (
        bookmarks.map((folder) => (
          <div key={folder.name} className="bookmark-folder">
            <h3>{folder.name}</h3>
            <ul>
              {folder.recipes.map((recipe) => (
                <li key={recipe.recipeId} className="recipe-item">
                  <img src={recipe.image} alt={recipe.title} />
                  <div>
                    <p>{recipe.title}</p>
                    <button onClick={() => cookRecipe(recipe)}>Cook It!</button>
                    {bookmarkStatus[recipe.recipeId] && (
                      <div className="status">
                        <p>{bookmarkStatus[recipe.recipeId].message}</p>
                        {bookmarkStatus[recipe.recipeId].missing?.length > 0 && (
                          <p>Missing: {bookmarkStatus[recipe.recipeId].missing.join(", ")}</p>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default Fridge;
