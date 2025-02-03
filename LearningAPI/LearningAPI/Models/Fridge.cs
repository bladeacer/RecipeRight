// File: Models/Fridge.cs
using System;

namespace LearningAPI.Models
{
    /// <summary>
    /// Represents an ingredient stored in a user's fridge.
    /// </summary>
    public class Fridge
    {
        /// <summary>
        /// Gets or sets the unique identifier for the fridge item.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the identifier of the user who owns this fridge item.
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Gets or sets the name of the ingredient.
        /// </summary>
        public string IngredientName { get; set; }

        /// <summary>
        /// Gets or sets the quantity of the ingredient.
        /// </summary>
        public double Quantity { get; set; }

        /// <summary>
        /// Gets or sets the unit of measurement for the ingredient.
        /// </summary>
        public string Unit { get; set; }

        /// <summary>
        /// Gets or sets the expiry date of the ingredient.
        /// </summary>
        public DateTime? ExpiryDate { get; set; }
    }
}
