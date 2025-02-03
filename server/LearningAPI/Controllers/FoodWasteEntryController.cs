using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using LearningAPI.Models;
using System.Security.Claims;
using LearningAPI;

[ApiController]
[Route("[controller]")]
public class FoodWasteEntryController(MyDbContext context, IMapper mapper, ILogger<FoodWasteEntryController> logger) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var wasteEntries = await context.FoodWasteEntries.Include(f => f.User).ToListAsync();
            return Ok(wasteEntries.Select(mapper.Map<FoodWasteEntryDTO>));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving food waste entries");
            return StatusCode(500);
        }
    }

    [HttpPost]
    public async Task<IActionResult> AddEntry(FoodWasteEntryRequest request)
    {
        try
        {
            int userId = GetUserId();
            var entry = new FoodWasteEntry
            {
                IngredientId = request.IngredientId,
                WasteAmount = request.WasteAmount,
                LoggedOn = request.LoggedOn,
                WasteReason = request.WasteReason,
                UserId = userId
            };
            await context.FoodWasteEntries.AddAsync(entry);
            await context.SaveChangesAsync();
            return Ok(mapper.Map<FoodWasteEntryDTO>(entry));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error adding food waste entry");
            return StatusCode(500);
        }
    }

    private int GetUserId()
    {
        return int.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
    }
}
