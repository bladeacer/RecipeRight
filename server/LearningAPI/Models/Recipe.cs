// File: LearningAPI/Models/Recipe.cs

using System.Collections.Generic;

namespace LearningAPI.Models
{
    public class PantryRequest
    {
        public string Pantry { get; set; }
    }
    public class RecipeResponse
    {
        public int id { get; set; }
        public string title { get; set; }
        public string image { get; set; }
        public List<Ingredient>? missedIngredients { get; set; }
    }

    public class Ingredient
    {
        public string Name { get; set; }
    }
}
