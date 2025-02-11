using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace RecipeRight.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly string OpenAIApiKey;

        public ChatController(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            OpenAIApiKey = configuration["OpenAI:ApiKey"] ?? throw new ArgumentNullException("OpenAI:ApiKey is not set in appsettings.json");
        }

        [HttpPost("message")]
        public async Task<IActionResult> GetChatbotResponse([FromBody] UserMessage userMessage)
        {
            if (string.IsNullOrWhiteSpace(userMessage.Message))
            {
                return BadRequest("Message cannot be empty.");
            }

            var prompt = $@"
You are an AI chatbot for the app RecipeRight. RecipeRight is a recipe app/website that allows users to:
1. Search for recipes using the Spoonacular API based on leftover ingredients in the Pantry.
2. Bookmark their favorite recipes.
3. Use the 'Fridge' feature to track and manage their leftover ingredients.

When the user asks about account, tell them about the account features which are:
1. Enable/Disable 2FA. (A 2FA code will be sent to the user's email)
2. Password recovery.
3. Profile customisation.

Only provide information about RecipeRight. If the user asks something completely unrelated, kindly respond: 'I am here to assist with RecipeRight-related questions only.'.
Talk in British English.


User: {userMessage.Message}
AI:";

            var openAIRequest = new
            {
                model = "gpt-3.5-turbo",
                messages = new[]
                {
                    new { role = "system", content = "You are an expert assistant for RecipeRight." },
                    new { role = "user", content = prompt }
                },
                max_tokens = 150
            };

            var json = JsonSerializer.Serialize(openAIRequest);

            try
            {
                // Create HttpRequestMessage
                var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions")
                {
                    Content = new StringContent(json, Encoding.UTF8, "application/json")
                };

                // Add Authorization header to HttpRequestMessage
                request.Headers.Add("Authorization", $"Bearer {OpenAIApiKey}");

                // Send the request
                var response = await _httpClient.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    var errorDetails = await response.Content.ReadAsStringAsync();
                    return StatusCode((int)response.StatusCode, $"Error from OpenAI: {errorDetails}");
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                return Ok(responseContent);
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(500, $"Request failed: {ex.Message}");
            }
        }
    }

    public class UserMessage
    {
        public string Message { get; set; }
    }
}
