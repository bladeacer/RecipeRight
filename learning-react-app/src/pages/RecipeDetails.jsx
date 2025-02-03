import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../http"; 
import DOMPurify from "dompurify"; // For HTML sanitisation
import "../themes/RecipeDetails.css";

const RecipeDetails = () => {
    const { id } = useParams();
    const [recipeDetails, setRecipeDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [folders, setFolders] = useState([]); // Stores available folders
    const [selectedFolder, setSelectedFolder] = useState(""); // Selected folder that user chose
    const [newFolderName, setNewFolderName] = useState(""); // Name input for new folder
    const [cookError, setCookError] = useState(""); // Error message for cook process
    const [cookMessage, setCookMessage] = useState(""); // Status message for cook process

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                const response = await http.get(`/api/Recipe/details/${id}`);
                setRecipeDetails(response.data);
            } catch (error) {
                console.error("Error fetching recipe details:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchFolders = async () => {
            try {
                const response = await http.get("/api/Bookmarks");
                setFolders(response.data);
            } catch (error) {
                console.error("Error fetching bookmark folders:", error);
            }
        };

        fetchRecipeDetails();
        fetchFolders();
    }, [id]);

    /**
     * Adds the current recipe to bookmarks.
     */
    const addBookmark = async () => {
        if (!selectedFolder && !newFolderName.trim()) {
            alert("Please select an existing folder or enter a new folder name.");
            return;
        }

        const folderToUse = selectedFolder || newFolderName.trim();

        try {
            await http.post("/api/Bookmarks/add", {
                folderName: folderToUse,
                recipeId: recipeDetails.id,
                title: recipeDetails.title,
                image: recipeDetails.image,
            });
            alert("Recipe bookmarked successfully!");
            setNewFolderName("");
            setSelectedFolder("");
        } catch (error) {
            console.error("Error adding bookmark:", error);
            alert("Failed to add bookmark.");
        }
    };

    /**
     * Initiates the cooking process for the recipe.
     * This function fetches the user's fridge items, checks if all required
     * ingredients are available, displays the cooking instructions, and then
     * removes the used ingredients from the fridge.
     */
    const cookRecipe = async () => {
        try {
            // Reset previous messages.
            setCookError("");
            setCookMessage("");

            // Fetch the user's current fridge items.
            const fridgeResponse = await http.get("/api/Fridge");
            const fridgeItems = fridgeResponse.data;

            if (!Array.isArray(fridgeItems)) {
                setCookError("Unexpected response for fridge items.");
                return;
            }

            // Determine missing ingredients by comparing the recipe's ingredients
            // with the fridge inventory (using case-insensitive matching).
            const missingIngredients = recipeDetails.extendedIngredients.filter((ingredient) => {
                // Assume ingredient object has a "name" property.
                return !fridgeItems.some(
                    (item) => item.ingredientName.toLowerCase() === ingredient.name.toLowerCase()
                );
            });

            if (missingIngredients.length > 0) {
                // Create a list of missing ingredient names.
                const missingNames = missingIngredients.map((i) => i.name);
                alert(`You are missing: ${missingNames.join(", ")}`);
                return;
            }

            // If all ingredients are available, start cooking.
            setCookMessage("Let's start cooking!");
            // Display cooking instructions.
            // If instructions are provided as HTML, we remove tags for alert display.
            let instructionsText = "";
            if (recipeDetails.instructions) {
                // Remove HTML tags using DOMPurify's default sanitizer.
                const sanitized = DOMPurify.sanitize(recipeDetails.instructions, { ALLOWED_TAGS: [] });
                instructionsText = sanitized.replace(/\s+/g, " ").trim();
            } else {
                instructionsText = "No detailed instructions available. Please refer to the recipe details.";
            }
            alert(`Cooking Instructions:\n${instructionsText}`);

            // Remove used ingredients from the fridge.
            for (let ingredient of recipeDetails.extendedIngredients) {
                // Find a matching fridge item (case-insensitive comparison).
                const matchingItem = fridgeItems.find(
                    (item) => item.ingredientName.toLowerCase() === ingredient.name.toLowerCase()
                );
                if (matchingItem && matchingItem.id) {
                    await http.delete(`/api/Fridge/remove/${matchingItem.id}`);
                }
            }

            alert("Cooking done! Ingredients used have been removed from your fridge.");
        } catch (error) {
            console.error("Error during cooking process:", error);
            setCookError("An error occurred during the cooking process.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!recipeDetails) {
        return <div>Recipe details could not be loaded.</div>;
    }

    const sanitizedSummary = DOMPurify.sanitize(recipeDetails.summary);

    return (
        <div className="recipe-details-page">
            <h1>{recipeDetails.title}</h1>
            <img src={recipeDetails.image} alt={recipeDetails.title} className="recipe-image" />
            <div className="recipe-summary" dangerouslySetInnerHTML={{ __html: sanitizedSummary }} />
            
            <h2>Ingredients</h2>
            <ul>
                {recipeDetails.extendedIngredients.map((ingredient) => (
                    <li key={ingredient.id}>{ingredient.original}</li>
                ))}
            </ul>

            <h2>Instructions</h2>
            {recipeDetails.instructions ? (
                <div dangerouslySetInnerHTML={{ __html: recipeDetails.instructions }} />
            ) : (
                <p>No detailed instructions available.</p>
            )}

            <div className="bookmark-section">
                <h3>Bookmark this Recipe</h3>
                <div className="folder-dropdown">
                    <select
                        value={selectedFolder}
                        onChange={(e) => setSelectedFolder(e.target.value)}
                    >
                        <option value="">Select a folder</option>
                        {folders.map((folder) => (
                            <option key={folder.name} value={folder.name}>
                                {folder.name}
                            </option>
                        ))}
                    </select>
                    <div className="new-folder">
                        <input
                            type="text"
                            placeholder="Add a new folder"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                        />
                    </div>
                </div>
                <button onClick={addBookmark}>Add Bookmark</button>
            </div>

            {/* --- Cook It! Section --- */}
            <div className="cook-section">
                <h3>Cook This Recipe</h3>
                {cookError && <p style={{ color: "red" }}>{cookError}</p>}
                {cookMessage && <p>{cookMessage}</p>}
                <button onClick={cookRecipe}>Cook It!</button>
            </div>
        </div>
    );
};

export default RecipeDetails;
