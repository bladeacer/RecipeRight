import React, { useState } from "react";
import "../App.css";
import http from "../http";
import { Link } from "react-router-dom";
import "../themes/Pantry.css";

const Pantry = () => {
    const [pantryItems, setPantryItems] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        setPantryItems(e.target.value);
    };

    // Fetch recipes based on pantry items
    const fetchRecipes = async () => {
        if (!pantryItems.trim()) {
            alert("Please enter items in your pantry before searching.");
            return;
        }

        setLoading(true);
        try {
            const response = await http.post("https://localhost:7004/api/Recipe/search", { pantry: pantryItems });
            if (response.data.length === 0) {
                alert("No recipes found. Please try different items.");
            }
            setRecipes(response.data);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pantry-page">
            <h1>Find Recipes Based on Your Pantry</h1>
            <div className="input-section">
                <input
                    type="text"
                    value={pantryItems}
                    onChange={handleChange}
                    placeholder="Enter items in your pantry (e.g., rice, chicken, butter)"
                />
                <button onClick={fetchRecipes} disabled={loading}>
                    {loading ? "Searching..." : "Search Recipes"}
                </button>
            </div>

            <div className="recipes-section">
                {recipes.length > 0 && <h2>Recipes Found:</h2>}
                <div className="recipes-list">
                    {recipes.map((recipe) => (
                        <div className="recipe-card" key={recipe.id}>
                            <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                            <div className="recipe-details">
                                <h3>
                                    <Link to={`/recipe/${recipe.id}`}>{recipe.title}</Link>
                                </h3>
                                <p>
                                    Missing Ingredients: {" "}
                                    {(recipe.missedIngredients && recipe.missedIngredients.length > 0)
                                        ? recipe.missedIngredients.map((ingredient) => ingredient.name).join(", ")
                                        : "None"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Pantry;
