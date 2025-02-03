using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using LearningAPI.Models;


namespace LearningAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipeController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private const string SpoonacularApiKey = "d55b00451c9a4dd6bd3dcc1a3857415a";
        private const string SpoonacularBaseUrl = "https://api.spoonacular.com/recipes";

        public RecipeController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpPost("search")]
        public async Task<IActionResult> SearchRecipes([FromBody] PantryRequest pantryRequest)
        {
            if (pantryRequest == null || string.IsNullOrWhiteSpace(pantryRequest.Pantry))
            {
                return BadRequest("Invalid pantry items.");
            }

            string ingredients = pantryRequest.Pantry;
            var url = $"{SpoonacularBaseUrl}/findByIngredients?ingredients={ingredients}&apiKey={SpoonacularApiKey}&number=10&ranking=1";

            try
            {
                var response = await _httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, "Error fetching recipes from Spoonacular API.");
                }

                var content = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                var recipes = JsonSerializer.Deserialize<List<RecipeResponse>>(content, options);

                return Ok(recipes);
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(500, $"Request failed: {ex.Message}");
            }
        }
        [HttpGet("details/{id}")]
        public async Task<IActionResult> GetRecipeDetails(int id)
        {
            var url = $"{SpoonacularBaseUrl}/{id}/information?apiKey={SpoonacularApiKey}";

            try
            {
                var response = await _httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, "Error fetching recipe details from Spoonacular API.");
                }

                var content = await response.Content.ReadAsStringAsync();
                return Ok(content);
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(500, $"Request failed: {ex.Message}");
            }
        }

    }
}
