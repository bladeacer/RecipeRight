import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import http from "../../http";
import "../../themes/Bookmarks.css";
import ChatButton from "../../components/ChatButton";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState(null);
  const [editedFolderName, setEditedFolderName] = useState("");
  const [deleteConfirmFolder, setDeleteConfirmFolder] = useState(null);

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
      setBookmarks((prev) =>
        prev.map((folder) =>
          folder.name === oldName ? { ...folder, name: newName } : folder
        )
      );
      setEditingFolder(null);
    } catch (error) {
      console.error("Error updating folder name:", error);
      alert("Failed to update folder name.");
    }
  };

  const removeRecipe = async (folderName, recipeId) => {
    try {
      await http.delete("/api/Bookmarks/remove", {
        headers: { "Content-Type": "application/json" },
        data: { folderName, recipeId },
      });

      setBookmarks((prev) =>
        prev.map((folder) =>
          folder.name === folderName
            ? {
                ...folder,
                recipes: folder.recipes.filter((r) => r.recipeId !== recipeId),
              }
            : folder
        )
      );
    } catch (error) {
      console.error("Error removing recipe:", error);
    }
  };

  const cancelEdit = () => {
    setEditingFolder(null);
    setEditedFolderName("");
  };

  const deleteFolder = async (folderName) => {
    try {
      await http.delete("/api/Bookmarks/folder", {
        data: { folderName },
      });
      setBookmarks((prev) =>
        prev.filter((folder) => folder.name !== folderName)
      );
      setDeleteConfirmFolder(null);
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
            <div className="folder-header">
              {/* Left-aligned folder name + Edit button */}
              <div className="folder-title">
                {editingFolder === folder.name ? (
                  <>
                    <input
                      type="text"
                      value={editedFolderName}
                      onChange={(e) => setEditedFolderName(e.target.value)}
                    />
                    <button
                      onClick={() =>
                        editFolderName(folder.name, editedFolderName)
                      }
                    >
                      Save
                    </button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <h2>{folder.name}</h2>
                    <button
                      className="edit-folder-button"
                      onClick={() => setEditingFolder(folder.name)}
                    >
                      ✏️
                    </button>
                  </>
                )}
              </div>

              {/* Right-aligned delete button */}
              <button
                className="delete-folder-button"
                onClick={() => setDeleteConfirmFolder(folder.name)}
              >
                🗑️ Delete Folder
              </button>
            </div>

            <ul>
              {folder.recipes.map((recipe) => (
                <li key={recipe.recipeId} className="bookmark-item">
                  <Link
                    to={`/recipe/${recipe.recipeId}`}
                    className="recipe-link"
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="bookmark-image"
                    />
                    <span>{recipe.title}</span>
                  </Link>
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

      {/* Delete Confirmation Popup */}
      {deleteConfirmFolder && (
        <dialog open className="confirm-dialog">
          <article>
            <header>
              <h5>Delete Folder</h5>
            </header>
            <p>Are you sure you want to delete "{deleteConfirmFolder}"?</p>
            <footer>
              <button onClick={() => setDeleteConfirmFolder(null)}>
                Cancel
              </button>
              <button
                className="delete-confirm-button"
                onClick={() => deleteFolder(deleteConfirmFolder)}
              >
                Confirm
              </button>
            </footer>
          </article>
        </dialog>
      )}

      <ChatButton />
    </div>
  );
};
export default Bookmarks;
