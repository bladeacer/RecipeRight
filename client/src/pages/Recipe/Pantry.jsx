import { useState, useEffect } from "react";
import "../../App.css";
import http from "../../http";
import { Link } from "react-router-dom";
import "../../themes/Pantry.css";
import ChatButton from "../../components/ChatButton";
const Pantry = () => {
    const [pantryItems, setPantryItems] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [invalidImages, setInvalidImages] = useState(new Set());


    // Fetch random recipes on page load
    useEffect(() => {
        fetchRandomRecipes();
    }, []);

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            fetchRecipes();
        }
    };

    const fetchRandomRecipes = async () => {
        setLoading(true);
        try {
            const response = await http.get("https://localhost:7004/api/Recipe/random?number=10");
            const data = response.data;

            if (data && data.recipes) {
                setRecipes(data.recipes); // Extract 'recipes' array from API response
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

    const handleChange = (e) => {
        setPantryItems(e.target.value);
    };

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
                    onKeyDown={handleKeyPress} // Listen for Enter key
                    placeholder="Enter items in your pantry (e.g., rice, chicken, butter)"
                />

                <button onClick={fetchRecipes} disabled={loading}>
                    {loading ? "Searching..." : "Search Recipes"}
                </button>
            </div>

            <div className="recipes-section">
                <h2>{pantryItems ? "Search Results" : "Popular Recipes"}</h2>
                <div className="recipes-list">
                    {recipes
                        .filter(recipe => !invalidImages.has(recipe.id)) // Filter out broken images
                        .map(recipe => (
                            <div className="recipe-card" key={recipe.id}>
                                <Link to={`/recipe/${recipe.id}`}>
                                    <img
                                        src={recipe.image}
                                        alt={recipe.title}
                                        className="recipe-image"
                                        onError={() => setInvalidImages(prev => new Set([...prev, recipe.id]))} // Mark as broken
                                    />
                                    <div className="recipe-details">
                                        <h3>{recipe.title}</h3>
                                        {recipe.missedIngredients && recipe.missedIngredients.length > 0 ? (
                                            <p className="missing-ingredients">
                                                Missing: {recipe.missedIngredients.map(ing => ing.name).join(", ")}
                                            </p>
                                        ) : pantryItems ? null : (
                                            <p className="missing-ingredients"> </p>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        ))}
                </div>

            </div>

            {/* Add Chat Button */}
            <ChatButton />
        </div>
    );
};

export default Pantry;
