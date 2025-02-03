using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using LearningAPI.Models;
using System.Security.Claims;
using LearningAPI;

[ApiController]
[Route("[controller]")]
public class SustainabilityBadgeController(MyDbContext context, IMapper mapper, ILogger<SustainabilityBadgeController> logger) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var badges = await context.SustainabilityBadges.Include(b => b.User).ToListAsync();
            return Ok(badges.Select(mapper.Map<SustainabilityBadgeDTO>));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving badges");
            return StatusCode(500);
        }
    }

    [HttpPost]
    public async Task<IActionResult> AddBadge(SustainabilityBadgeRequest request)
    {
        try
        {
            int userId = GetUserId();
            var badge = new SustainabilityBadge
            {
                BadgeName = request.BadgeName,
                BadgeDescription = request.BadgeDescription,
                AwardedOn = request.AwardedOn,
                UserId = userId
            };
            await context.SustainabilityBadges.AddAsync(badge);
            await context.SaveChangesAsync();
            return Ok(mapper.Map<SustainabilityBadgeDTO>(badge));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error adding badge");
            return StatusCode(500);
        }
    }

    private int GetUserId()
    {
        return int.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
    }
}
