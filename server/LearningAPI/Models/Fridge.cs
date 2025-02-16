using System;

namespace LearningAPI.Models
{
    public class Fridge
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public string IngredientName { get; set; }
        public double Quantity { get; set; }

        public string Unit { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }
}
