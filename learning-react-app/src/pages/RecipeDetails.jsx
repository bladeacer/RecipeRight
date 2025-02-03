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
    const [newFolderName, setNewFolderName] = useState(""); //  name input for new folder

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
        </div>
    );
};

export default RecipeDetails;
