import { useState, useEffect } from "react";
import "../../App.css";
import http from "../../http";
import { Link } from "react-router-dom";
import "../../themes/RecipePlanner.css";
import ChatButton from "../../components/ChatButton";

export default function RecipePlanner() {
    const [fridgeItems, setFridgeItems] = useState([]);
    const [mealPlan, setMealPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [invalidImages, setInvalidImages] = useState(new Set());

    // Fetch fridge items on page load
    useEffect(() => {
        fetchFridgeItems();
    }, []);

    const fetchFridgeItems = async () => {
        try {
            const response = await http.get("/api/Fridge");
            setFridgeItems(response.data);
        } catch (err) {
            console.error("Error fetching fridge items:", err);
            setError("Failed to fetch fridge items.");
        }
    };

    // Generate a daily meal plan
    const generateMealPlan = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await http.post("/api/mealplanner/generate", {
                timeFrame: "day", // 🔹 Now fixed to "day" only
            });

            console.log("Raw API Response:", response.data);
            if (!response.data.meals || response.data.meals.length === 0) {
                setError("No meals found. Try adding more ingredients.");
                setMealPlan(null);
            } else {
                setMealPlan(response.data);
            }
        } catch (err) {
            console.error("Error generating meal plan:", err);
            setError(err.response?.data?.message || "Failed to generate meal plan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recipe-planner-container">
            <h1>Daily Meal Plan</h1>
            <p className="page-description">
                Generate daily meal plans with detailed nutrition information!
            </p>

            {/* Generate Button */}
            <button onClick={generateMealPlan} disabled={loading} className="generate-button">
                {loading ? "Generating..." : "Generate Meal Plan"}
            </button>

            {/* Error Message */}
            {error && <p className="error-message">{error}</p>}

            {/* Meal Plan Display */}
            {mealPlan && (
                <div className="meal-plan-section">
                    <h2>Today's Meal Plan</h2>
                    <p className="nutritional-info">Calories: {mealPlan.nutrients?.calories}</p>
                    <p className="nutritional-info">Protein: {mealPlan.nutrients?.protein}g</p>
                    <p className="nutritional-info">Fat: {mealPlan.nutrients?.fat}g</p>
                    <p className="nutritional-info">Carbohydrates: {mealPlan.nutrients?.carbohydrates}g</p>

                    {/* Recipe Cards */}
                    <div className="recipes-list">
                        {mealPlan.meals
                            .filter(meal => !invalidImages.has(meal.id))
                            .map(meal => (
                                <div className="recipe-card" key={meal.id}>
                                    <Link to={`/recipe/${meal.id}`}>
                                        <img
                                            src={`https://spoonacular.com/recipeImages/${meal.id}-312x231.jpg`}
                                            alt={meal.title}
                                            className="recipe-image"
                                            onError={() => setInvalidImages(prev => new Set([...prev, meal.id]))}
                                        />
                                        <div className="recipe-details">
                                            <h3>{meal.title}</h3>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Chat Button */}
            <div className="chat-button-container">
                <ChatButton />
            </div>
        </div>
    );
}
