using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Collections.Generic;
using LearningAPI.Models;

namespace LearningAPI.Controllers
{
    /// <summary>
    /// API controller for managing fridge items.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Ensures all actions require authentication
    public class FridgeController : ControllerBase
    {
        private readonly MyDbContext _context;

        /// <summary>
        /// Initializes a new instance of the <see cref="FridgeController"/> class.
        /// </summary>
        /// <param name="context">The database context for accessing fridge items.</param>
        public FridgeController(MyDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retrieves all fridge items for the authenticated user.
        /// </summary>
        /// <returns>A list of fridge items if successful; otherwise, an error response.</returns>
        [HttpGet]
        public async Task<IActionResult> GetFridgeItems()
        {
            var userId = int.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);

            try
            {
                // Retrieve fridge items for the authenticated user.
                var items = await _context.Fridges
                    .Where(f => f.UserId == userId)
                    .ToListAsync();

                return Ok(items);
            }
            catch
            {
                // Log exception in production.
                return StatusCode(500, "An error occurred while retrieving fridge items.");
            }
        }

        /// <summary>
        /// Adds a new ingredient to the authenticated user's fridge.
        /// </summary>
        /// <param name="newItem">The fridge item to add.</param>
        /// <returns>The added fridge item if successful; otherwise, an error response.</returns>
        [HttpPost("add")]
        public async Task<IActionResult> AddFridgeItem([FromBody] Fridge newItem)
        {
            if (newItem == null)
            {
                return BadRequest("Request body is null.");
            }

            if (string.IsNullOrWhiteSpace(newItem.IngredientName) || newItem.Quantity <= 0 || string.IsNullOrWhiteSpace(newItem.Unit))
            {
                return BadRequest("All fields except expiry date are required.");
            }

            var userId = int.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);

            try
            {
                newItem.UserId = userId;

                _context.Fridges.Add(newItem);
                await _context.SaveChangesAsync();

                return Ok(newItem);
            }
            catch
            {
                return StatusCode(500, "An error occurred while adding the fridge item.");
            }
        }


        /// <summary>
        /// Removes an ingredient from the authenticated user's fridge by its ID.
        /// </summary>
        /// <param name="id">The ID of the fridge item to remove.</param>
        /// <returns>A status message indicating the result of the removal.</returns>
        [HttpDelete("remove/{id}")]
        public async Task<IActionResult> RemoveFridgeItem(int id)
        {
            var userId = int.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);

            try
            {
                // Retrieve the fridge item ensuring it belongs to the authenticated user.
                var item = await _context.Fridges.FirstOrDefaultAsync(f => f.Id == id && f.UserId == userId);
                if (item == null)
                {
                    return NotFound("Fridge item not found.");
                }

                _context.Fridges.Remove(item);
                await _context.SaveChangesAsync();
                return Ok("Fridge item removed successfully.");
            }
            catch
            {
                // Log exception in production.
                return StatusCode(500, "An error occurred while removing the fridge item.");
            }
        }
    }
}
