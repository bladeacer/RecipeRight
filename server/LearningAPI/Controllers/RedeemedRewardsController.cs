using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningAPI.Controllers
{
    [Route("api/redeemed-rewards")]
    [ApiController]
    public class RedeemedRewardsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RedeemedRewardsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/redeemed-rewards/{id}
        [HttpPost("{id}")]
        [Authorize]
        public async Task<IActionResult> RedeemReward(int id)
        {
            var userId = int.Parse(User.Claims.First(c => c.Type == "userId").Value);

            var user = await _context.Users.FindAsync(userId);
            var reward = await _context.Rewards.FindAsync(id);

            if (user == null || reward == null)
            {
                return NotFound(new { message = "Reward or User not found" });
            }

            if (user.Point < reward.Point)
            {
                return BadRequest(new { message = "You do not have enough points" });
            }

            user.Point -= reward.Point;
            await _context.SaveChangesAsync();

            var redeemedReward = new RedeemedRewards
            {
                UserId = user.Id,
                RewardId = reward.Id,
                RewardName = reward.RewardName,
                ExpiryDate = reward.ExpiryDate,
                Description = reward.Description,
                Code = GenerateRedemptionCode()
            };

            _context.RedeemedRewards.Add(redeemedReward);
            _context.Rewards.Remove(reward); // Remove the redeemed reward
            await _context.SaveChangesAsync();

            return Ok(new { message = "Reward successfully redeemed" });
        }

        // GET: api/redeemed-rewards
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUserRedeemedRewards()
        {
            var userId = int.Parse(User.Claims.First(c => c.Type == "userId").Value);

            var redeemedRewards = await _context
                .RedeemedRewards.Where(rr => rr.UserId == userId)
                .ToListAsync();

            if (!redeemedRewards.Any())
            {
                return NotFound(new { message = "User has not redeemed any rewards" });
            }

            return Ok(redeemedRewards);
        }

        // DELETE: api/redeemed-rewards/{code}
        [HttpDelete("{code}")]
        [Authorize]
        public async Task<IActionResult> DeleteRedeemedReward(string code)
        {
            var userId = int.Parse(User.Claims.First(c => c.Type == "userId").Value);

            var redeemedReward = await _context.RedeemedRewards.FirstOrDefaultAsync(rr =>
                rr.UserId == userId && rr.Code == code
            );

            if (redeemedReward == null)
            {
                return NotFound(new { message = "Reward not found" });
            }

            _context.RedeemedRewards.Remove(redeemedReward);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Reward successfully deleted" });
        }

        private string GenerateRedemptionCode()
        {
            return Guid.NewGuid().ToString("N").Substring(0, 7);
        }
    }
}
