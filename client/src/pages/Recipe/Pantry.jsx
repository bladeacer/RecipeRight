import { useState, useEffect } from "react";
import "../../App.css";
import http from "../../http";
import { Link } from "react-router-dom";
import "../../themes/Pantry.css";
import ChatButton from "../../components/ChatButton";

const Pantry = () => {
    const [pantryItems, setPantryItems] = useState("");
    const [fridgeItems, setFridgeItems] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [invalidImages, setInvalidImages] = useState(new Set());

    // Fetch fridge ingredients on page load
    useEffect(() => {
        fetchFridgeItems();
        fetchRandomRecipes();
    }, []);

    const fetchFridgeItems = async () => {
        try {
            const response = await http.get("https://localhost:7004/api/Fridge");
            setFridgeItems(response.data.map(item => item.ingredientName));
        } catch (error) {
            console.error("Error fetching fridge ingredients:", error);
        }
    };

    const fetchRandomRecipes = async () => {
        setLoading(true);
        try {
            const response = await http.get("https://localhost:7004/api/Recipe/random?number=10");
            const data = response.data;

            if (data && data.recipes) {
                setRecipes(data.recipes);
            } else {
                console.error("Invalid response format:", data);
                setRecipes([]);
            }
        } catch (error) {
            console.error("Error fetching random recipes:", error);
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecipes = async () => {
        if (!pantryItems.trim()) {
            alert("Please enter items in your pantry or use fridge ingredients.");
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

    // Autofill pantry input with fridge ingredients
    const useFridgeIngredients = () => {
        if (fridgeItems.length === 0) {
            alert("No ingredients found in the fridge.");
            return;
        }
        setPantryItems(fridgeItems.join(", "));
    };

    return (
        <div className="pantry-page">
            <h1>Find Recipes Based on Your Pantry & Fridge</h1>
            <p className="page-description">
                Enter the ingredients you have in your pantry or use items from your fridge to find matching recipes.
            </p>

            <div className="input-section">
                <input
                    type="text"
                    value={pantryItems}
                    onChange={(e) => setPantryItems(e.target.value)}
                    placeholder="Enter pantry items (e.g., rice, chicken, butter)"
                />
                <div className="button-group">
                    <button onClick={fetchRecipes} disabled={loading}>
                        {loading ? "Searching..." : "Search Recipes"}
                    </button>
                    <button onClick={useFridgeIngredients} className="fridge-button">
                        Import Fridge Ingredients
                    </button>
                </div>
            </div>

            <div className="recipes-section">
                <h2>{pantryItems ? "Search Results" : "Popular Recipes"}</h2>
                <div className="recipes-list">
                    {recipes
                        .filter(recipe => !invalidImages.has(recipe.id))
                        .map(recipe => (
                            <div className="recipe-card" key={recipe.id}>
                                <Link to={`/recipe/${recipe.id}`}>
                                    <img
                                        src={recipe.image}
                                        alt={recipe.title}
                                        className="recipe-image"
                                        onError={() => setInvalidImages(prev => new Set([...prev, recipe.id]))}
                                    />
                                    <div className="recipe-details">
                                        <h3>{recipe.title}</h3>
                                        {recipe.missedIngredients && recipe.missedIngredients.length > 0 ? (
                                            <p className="missing-ingredients">
                                                Missing: {recipe.missedIngredients.map(ing => ing.name).join(", ")}
                                            </p>
                                        ) : null}
                                    </div>
                                </Link>
                            </div>
                        ))}
                </div>
            </div>

            {/* Chat Button */}
            <ChatButton />
        </div>
    );
};

export default Pantry;
