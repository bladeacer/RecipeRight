import { useState, useEffect } from "react";
import http from "../../http";
import ChatButton from "../../components/ChatButton";
import "../../themes/Fridge.css";

const Fridge = () => {
  const [fridgeItems, setFridgeItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 14;

  const [newItem, setNewItem] = useState({
    ingredientName: "",
    quantity: 0,
    unit: "",
    expiryDate: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  // Fetch fridge items
  useEffect(() => {
    fetchFridgeItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchQuery, fridgeItems]);

  const fetchFridgeItems = async () => {
    try {
      const response = await http.get("/api/Fridge");
      setFridgeItems(response.data);
      setFilteredItems(response.data);
    } catch (err) {
      console.error("Error fetching fridge items:", err);
      setError("Failed to fetch fridge items.");
    }
  };

  // Filter ingredients based on search input
  const filterItems = () => {
    const filtered = fridgeItems.filter((item) =>
      item.ingredientName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  // Handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  // Add an ingredient
  const handleAddItem = async (event) => {
    event.preventDefault();

    if (
      !newItem.ingredientName.trim() ||
      newItem.quantity <= 0 ||
      !newItem.unit.trim()
    ) {
      setError("Please fill out all fields except expiry date.");
      return;
    }

    setError("");
    try {
      const payload = { ...newItem };
      if (!payload.expiryDate.trim()) delete payload.expiryDate;

      const response = await http.post("/api/Fridge/add", payload);
      setFridgeItems((prev) => [...prev, response.data]);
      setNewItem({ ingredientName: "", quantity: 0, unit: "", expiryDate: "" });
      setMessage("Ingredient added successfully!");
    } catch (err) {
      console.error("Error adding fridge item:", err);
      setError("Failed to add new ingredient.");
    }
  };

  // Remove an ingredient
  const handleRemoveItem = async (id) => {
    try {
      await http.delete(`/api/Fridge/remove/${id}`);
      setFridgeItems((prev) => prev.filter((item) => item.id !== id));
      setMessage("Ingredient removed successfully!");
    } catch (err) {
      console.error("Error removing fridge item:", err);
      setError("Failed to remove the ingredient.");
    }
  };

  // Open confirmation modal
  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  // Remove all ingredients
  const handleRemoveAll = async () => {
    try {
      await http.delete("/api/Fridge/removeAll");
      setFridgeItems([]);
      setMessage("All ingredients removed successfully!");
      handleCloseConfirm();
    } catch (err) {
      console.error("Error removing all fridge items:", err);
      setError("Failed to remove all ingredients.");
    }
  };

  // Add Sample Data
  const addSampleData = async () => {
    const sampleIngredients = [
      { ingredientName: "Chicken Breast", quantity: 2, unit: "pieces" },
      { ingredientName: "Ground Beef", quantity: 500, unit: "g" },
      { ingredientName: "Salmon Fillet", quantity: 2, unit: "fillets" },
      { ingredientName: "Eggs", quantity: 12, unit: "pcs" },
      { ingredientName: "Carrots", quantity: 4, unit: "pcs" },
      { ingredientName: "Spinach", quantity: 1, unit: "bunch" },
      { ingredientName: "Bell Peppers", quantity: 3, unit: "pcs" },
      { ingredientName: "Broccoli", quantity: 1, unit: "head" },
      { ingredientName: "Rice", quantity: 2, unit: "cups" },
      { ingredientName: "Pasta", quantity: 1, unit: "box" },
      { ingredientName: "Milk", quantity: 1, unit: "liter" },
      { ingredientName: "Cheese", quantity: 200, unit: "g" },
      { ingredientName: "Olive Oil", quantity: 500, unit: "ml" },
      { ingredientName: "Garlic", quantity: 3, unit: "cloves" },
      { ingredientName: "Tomatoes", quantity: 5, unit: "pcs" },
      { ingredientName: "Onions", quantity: 3, unit: "pcs" },
      { ingredientName: "Butter", quantity: 250, unit: "g" },
      { ingredientName: "Mushrooms", quantity: 200, unit: "g" },
      { ingredientName: "Flour", quantity: 1, unit: "kg" },
      { ingredientName: "Sugar", quantity: 500, unit: "g" },
      { ingredientName: "Yogurt", quantity: 1, unit: "cup" },
    ];

    try {
      await Promise.all(
        sampleIngredients.map((ingredient) =>
          http.post("/api/Fridge/add", ingredient)
        )
      );
      setMessage("Sample ingredients added successfully!");
      fetchFridgeItems();
    } catch (err) {
      console.error("Error adding sample data:", err);
      setError("Failed to add sample ingredients.");
    }
  };

  // Pagination Controls
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container">
      <h2>My Fridge</h2>
      <p className="page-description">
        This is your fridge inventory. You can add, remove, and manage
        ingredients to keep track of what you have available for cooking.
      </p>
      {error && <p className="pico-color-red-500">{error}</p>}
      {message && <p className="pico-color-green-500">{message}</p>}

      {/* Form to Add Ingredients (Vertical Layout) */}
      <form onSubmit={handleAddItem}>
        <label>Ingredient Name</label>
        <input
          type="text"
          name="ingredientName"
          value={newItem.ingredientName}
          onChange={handleInputChange}
          required
        />

        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          value={newItem.quantity}
          onChange={handleInputChange}
          min="0"
          step="0.01"
          required
        />

        <label>Unit (e.g., g, ml, pcs)</label>
        <input
          type="text"
          name="unit"
          value={newItem.unit}
          onChange={handleInputChange}
          required
        />

        <label>Expiry Date</label>
        <input
          type="date"
          name="expiryDate"
          value={newItem.expiryDate}
          onChange={handleInputChange}
        />

        <button type="submit" className="pico-background-emerald-500">
          Add Ingredient
        </button>
      </form>

      {/* Button Container for Remove all and Sample Data */}
      <div className="button-row">
        <button className="pico-background-red-500" onClick={handleOpenConfirm}>
          Remove All Ingredients
        </button>
        <button className="pico-background-azure-500" onClick={addSampleData}>
          Add Sample Data
        </button>
      </div>

      {/* Search Filter */}
      <input
        type="text"
        className="search-bar"
        placeholder="Search Ingredients..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Confirmation Modal */}
      {openConfirm && (
        <dialog open={openConfirm} onClose={handleCloseConfirm}>
          <article>
            <header>
              <h5>Confirm Deletion</h5>
            </header>
            <p>
              Are you sure you want to{" "}
              <span className="pico-color-red-500">remove all ingredients</span>{" "}
              from your fridge?
            </p>
            <footer>
              <button onClick={handleCloseConfirm}>Cancel</button>
              <button
                className="pico-background-red-500"
                onClick={handleRemoveAll}
              >
                Remove All
              </button>
            </footer>
          </article>
        </dialog>
      )}

      {/* List of Fridge Items in Compact Grid */}
      <div className="ingredient-grid">
        {currentItems.map((item) => (
          <div key={item.id} className="ingredient-card">
            <p>
              <strong>{item.ingredientName}</strong>
            </p>
            <p>
              {item.quantity} {item.unit}
            </p>
            <p>{item.expiryDate || "N/A"}</p>
            <button
              className="pico-background-red-500"
              onClick={() => handleRemoveItem(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Centered Pagination Controls */}
      <div className="pagination">
        {totalPages > 1 && (
          <>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              Next
            </button>
          </>
        )}
      </div>

      <ChatButton />
    </div>
  );
};

export default Fridge;
