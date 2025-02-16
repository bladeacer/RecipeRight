using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using LearningAPI.Models;
using Microsoft.Extensions.Configuration;

namespace LearningAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipeController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly string _spoonacularApiKey;
        private const string SpoonacularBaseUrl = "https://api.spoonacular.com/recipes";

        public RecipeController(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _spoonacularApiKey = configuration["Spoonacular:ApiKey"] ?? throw new ArgumentNullException("Spoonacular API Key is missing from appsettings.json");
        }

        [HttpPost("search")]
        public async Task<IActionResult> SearchRecipes([FromBody] PantryRequest pantryRequest)
        {
            if (pantryRequest == null || string.IsNullOrWhiteSpace(pantryRequest.Pantry))
            {
                return BadRequest("Invalid pantry items.");
            }

            string ingredients = pantryRequest.Pantry;
            var url = $"{SpoonacularBaseUrl}/findByIngredients?ingredients={ingredients}&apiKey={_spoonacularApiKey}&number=10&ranking=1";

            try
            {
                var response = await _httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, "Error fetching recipes from Spoonacular API.");
                }

                var content = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
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
            var url = $"{SpoonacularBaseUrl}/{id}/information?apiKey={_spoonacularApiKey}";

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

        [HttpGet("random")]
        public async Task<IActionResult> GetRandomRecipes([FromQuery] int number = 10, [FromQuery] string includeTags = "", [FromQuery] string excludeTags = "")
        {
            var url = $"{SpoonacularBaseUrl}/random?number={number}&apiKey={_spoonacularApiKey}";

            if (!string.IsNullOrEmpty(includeTags))
            {
                url += $"&include-tags={includeTags}";
            }

            if (!string.IsNullOrEmpty(excludeTags))
            {
                url += $"&exclude-tags={excludeTags}";
            }

            try
            {
                var response = await _httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, "Error fetching random recipes from Spoonacular API.");
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
