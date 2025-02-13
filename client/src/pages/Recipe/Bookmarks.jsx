import React, { useState, useEffect } from "react";
import http from "../../http";
import "../../themes/Bookmarks.css";


const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newFolderName, setNewFolderName] = useState("");
    const [editingFolder, setEditingFolder] = useState(null); 
    const [editedFolderName, setEditedFolderName] = useState("");

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const response = await http.get("/api/Bookmarks");
                setBookmarks(response.data);
            } catch (error) {
                console.error("Error fetching bookmarks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, []);

    const addFolder = async () => {
        if (!newFolderName.trim()) {
            alert("Folder name cannot be empty.");
            return;
        }

        try {
            await http.post("/api/Bookmarks/add", { folderName: newFolderName });
            alert("Folder added successfully!");
            setNewFolderName("");
        } catch (error) {
            console.error("Error adding folder:", error);
            alert("Failed to add folder.");
        }
    };

    const editFolderName = async (oldName, newName) => {
        if (!newName.trim()) {
            alert("New folder name cannot be empty.");
            return;
        }

        try {
            await http.put("/api/Bookmarks/edit", { oldName, newName });
            alert("Folder name updated successfully!");
            setBookmarks((prev) =>
                prev.map((folder) =>
                    folder.name === oldName ? { ...folder, name: newName } : folder
                )
            );
            setEditingFolder(null); // stop editing
        } catch (error) {
            console.error("Error updating folder name:", error);
            alert("Failed to update folder name.");
        }
    };

    const cancelEdit = () => {
        setEditingFolder(null);
        setEditedFolderName("");
    };

    const removeRecipe = async (folderName, recipeId) => {
        try {
            await http.delete("/api/Bookmarks/remove", {
                headers: { "Content-Type": "application/json" },
                data: { folderName, recipeId },
            });
            alert("Recipe removed successfully!");
            setBookmarks((prev) =>
                prev.map((folder) =>
                    folder.name === folderName
                        ? { ...folder, recipes: folder.recipes.filter((r) => r.recipeId !== recipeId) }
                        : folder
                )
            );
        } catch (error) {
            console.error("Error removing recipe:", error);
            alert("Failed to remove recipe.");
        }
    };
    

    const deleteFolder = async (folderName) => {
        try {
            await http.delete("/api/Bookmarks/folder", {
                data: { folderName },
            });
            alert("Folder deleted successfully!");
            setBookmarks((prev) => prev.filter((folder) => folder.name !== folderName));
        } catch (error) {
            console.error("Error deleting folder:", error);
            alert("Failed to delete folder.");
        }
    };

    if (loading) {
        return <div>Loading bookmarks...</div>;
    }

    return (
        <div className="bookmarks-page">
            <h1>Your Bookmarks</h1>

            {/* Add New Folder */}
            <div className="add-folder-section">
                <input
                    type="text"
                    placeholder="Enter folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                />
                <button onClick={addFolder}>Add Folder</button>
            </div>

            {/* Display Folders and Recipes */}
            {bookmarks.length > 0 ? (
                bookmarks.map((folder) => (
                    <div key={folder.name} className="bookmark-folder">
                        <h2>
                            {editingFolder === folder.name ? (
                                <>
                                    <input
                                        type="text"
                                        value={editedFolderName}
                                        onChange={(e) => setEditedFolderName(e.target.value)}
                                    />
                                    <button onClick={() => editFolderName(folder.name, editedFolderName)}>Save</button>
                                    <button onClick={cancelEdit}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    {folder.name}
                                    <button onClick={() => setEditingFolder(folder.name)}>Edit</button>
                                    <button onClick={() => deleteFolder(folder.name)}>Delete Folder</button>
                                </>
                            )}
                        </h2>
                        <ul>
                            {folder.recipes.map((recipe) => (
                                <li key={recipe.recipeId} className="bookmark-item">
                                    <img src={recipe.image} alt={recipe.title} className="bookmark-image" />
                                    <span>{recipe.title}</span>
                                    <button
                                        onClick={() => removeRecipe(folder.name, recipe.recipeId)}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <p>No bookmarks found.</p>
            )}
        </div>
    );
};

export default Bookmarks;
