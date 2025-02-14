import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddSustainabilityBadge = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/sustainabilityBadges", {
        name,
        description,
      });
      navigate("/sustainability-badges");
    } catch (error) {
      console.error("Error adding sustainability badge:", error);
    }
  };

  return (
    <div>
      <h1>Add Sustainability Badge</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Badge Name</label>
          <br />
          <input
            type="text"
            placeholder="Badge Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>Description</label>
          <br />
          <textarea
            placeholder="Badge Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <button type="submit">Add Badge</button>
        </div>
      </form>
    </div>
  );
};

export default AddSustainabilityBadge;
