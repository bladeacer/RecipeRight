using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using System.Security.Claims;
using LearningAPI.Models;

namespace LearningAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MealPlannerController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly HttpClient _httpClient;
        private readonly string _spoonacularApiKey;
        private const string SpoonacularBaseUrl = "https://api.spoonacular.com/mealplanner/generate";

        public MealPlannerController(MyDbContext context, HttpClient httpClient, IConfiguration configuration)
        {
            _context = context;
            _httpClient = httpClient;
            _spoonacularApiKey = configuration["Spoonacular:ApiKey"] ?? throw new ArgumentNullException("Spoonacular API Key is missing from appsettings.json");
        }

        /// Generates a meal plan based on user's fridge items.
        [HttpPost("generate")]
        public async Task<IActionResult> GenerateMealPlan([FromBody] MealPlanRequest request)
        {
            var userId = int.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);

            var fridgeItems = await _context.Fridges
                .Where(f => f.UserId == userId)
                .Select(f => f.IngredientName)
                .ToListAsync();

            // Check if the user has enough ingredients
            if (!fridgeItems.Any())
            {
                return BadRequest(new { message = "Your fridge is empty! Add more ingredients to generate a meal plan." });
            }

            if (request.TimeFrame == "week" && fridgeItems.Count < 5)
            {
                return BadRequest(new { message = "Not enough ingredients for a full week. Try adding more ingredients!" });
            }

            string url = $"https://api.spoonacular.com/mealplanner/generate?timeFrame={request.TimeFrame}&apiKey={_spoonacularApiKey}";

            try
            {
                var response = await _httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, "Error fetching meal plan from Spoonacular API.");
                }

                var content = await response.Content.ReadAsStringAsync();
                var mealPlan = JsonSerializer.Deserialize<MealPlanResponse>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                return Ok(mealPlan);
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(500, $"Request failed: {ex.Message}");
            }
        }


        /// Retrieves a saved meal plan for a specific date.
        [HttpGet("{date}")]
        public async Task<IActionResult> GetMealPlan(string date)
        {
            var userId = int.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
            var mealPlan = await _context.MealPlans
                .Where(mp => mp.UserId == userId && mp.Date == date)
                .ToListAsync();

            if (!mealPlan.Any())
            {
                return NotFound("No meal plan found for this date.");
            }

            return Ok(mealPlan);
        }

        /// Deletes a saved meal plan.
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMealPlan(int id)
        {
            var userId = int.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
            var mealPlan = await _context.MealPlans.FirstOrDefaultAsync(mp => mp.Id == id && mp.UserId == userId);

            if (mealPlan == null)
            {
                return NotFound("Meal plan not found.");
            }

            _context.MealPlans.Remove(mealPlan);
            await _context.SaveChangesAsync();
            return Ok("Meal plan deleted successfully.");
        }
    }

    public class MealPlanRequest
    {
        public string TimeFrame { get; set; } = "day";
    }

    public class MealPlanResponse
    {
        public List<Meal> Meals { get; set; }
        public Nutrients Nutrients { get; set; }
    }

    public class Meal
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string SourceUrl { get; set; }
    }

    public class Nutrients
    {
        public double Calories { get; set; }
        public double Protein { get; set; }
        public double Fat { get; set; }
        public double Carbohydrates { get; set; }
    }
}
