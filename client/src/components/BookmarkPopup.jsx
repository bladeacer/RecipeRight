import { useState, useEffect } from "react";
import http from "../http";
import "../themes/BookmarkPopup.css";

const BookmarkPopup = ({ recipe, onClose }) => {
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [newFolderName, setNewFolderName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [bookmarkedFolders, setBookmarkedFolders] = useState(new Set());

    useEffect(() => {
        fetchFolders();
    }, []);

    // Fetch user's existing bookmark folders and check if the recipe is already saved
    const fetchFolders = async () => {
        try {
            const response = await http.get("/api/Bookmarks");
            setFolders(response.data);

            // Check which folders already contain this recipe
            const bookmarked = new Set();
            response.data.forEach(folder => {
                if (folder.recipes.some(r => r.recipeId === recipe.id)) {
                    bookmarked.add(folder.name);
                }
            });

            setBookmarkedFolders(bookmarked);
        } catch (err) {
            console.error("Error fetching bookmarks:", err);
            setError("Failed to load bookmark folders.");
        }
    };

    // Add recipe to selected folder
    const handleSaveBookmark = async () => {
        if (!selectedFolder) {
            alert("Please select a folder or create a new one.");
            return;
        }

        if (bookmarkedFolders.has(selectedFolder)) {
            alert("Recipe already in this bookmark!");
            return;
        }

        setLoading(true);
        try {
            await http.post("/api/Bookmarks/add", {
                folderName: selectedFolder,
                recipeId: recipe.id,
                title: recipe.title,
                image: recipe.image,
            });
            onClose();
        } catch (err) {
            console.error("Error saving bookmark:", err);
            setError("Failed to save bookmark.");
        } finally {
            setLoading(false);
        }
    };

    // Create a new folder and add recipe
    const handleCreateFolderAndSave = async () => {
        if (!newFolderName.trim()) {
            alert("Folder name cannot be empty.");
            return;
        }

        setLoading(true);
        try {
            await http.post("/api/Bookmarks/add", {
                folderName: newFolderName,
                recipeId: recipe.id,
                title: recipe.title,
                image: recipe.image,
            });
            setNewFolderName("");
            fetchFolders(); // Refresh folders list
            onClose();
        } catch (err) {
            console.error("Error creating folder:", err);
            setError("Failed to create folder.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bookmark-popup-overlay">
            <div className="bookmark-popup">
                <header>
                    <h3>Save recipe to...</h3>
                    <button className="close-button" onClick={onClose}>✖</button>
                </header>

                {error && <p className="error-message">{error}</p>}

                {/* Folder List */}
                <div className="folder-list">
                    {folders.map(folder => (
                        <label key={folder.name} className="folder-item">
                            <input
                                type="checkbox"
                                checked={selectedFolder === folder.name}
                                onChange={() => setSelectedFolder(folder.name)}
                                disabled={bookmarkedFolders.has(folder.name)} // Disable if already saved
                            />
                            {folder.name}
                            {bookmarkedFolders.has(folder.name) && (
                                <span className="already-saved"> (Recipe already in bookmark!)</span>
                            )}
                        </label>
                    ))}
                </div>

                {/* Create New Folder */}
                <div className="new-folder">
                    <input
                        type="text"
                        placeholder="New Folder Name"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                    />
                    <button onClick={handleCreateFolderAndSave} disabled={loading}>+ Create</button>
                </div>

                {/* Save Button */}
                <button className="save-button" onClick={handleSaveBookmark} disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
};

export default BookmarkPopup;
