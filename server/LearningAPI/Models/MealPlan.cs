using System;
using System.ComponentModel.DataAnnotations;

namespace LearningAPI.Models
{
    public class MealPlan
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Date { get; set; } = string.Empty;

        [MaxLength(5000)]
        public string MealData { get; set; } // JSON string of the meal plan
    }
}
