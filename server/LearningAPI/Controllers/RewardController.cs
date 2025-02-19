using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourNamespace.Models;

namespace LearningAPI.Controllers
{
    [Route("api/rewards")]
    [ApiController]
    public class RewardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RewardController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/rewards
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateReward([FromBody] RewardRequestDto rewardDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = int.Parse(User.Claims.First(c => c.Type == "userId").Value); // Extract User ID from token

            var reward = new Reward
            {
                RewardName = rewardDto.RewardName,
                Description = rewardDto.Description,
                Point = rewardDto.Point,
                ExpiryDate = rewardDto.ExpiryDate,
                UserId = userId
            };

            _context.Rewards.Add(reward);
            await _context.SaveChangesAsync();
            return Ok(reward);
        }

        // GET: api/rewards
        [HttpGet]
        public async Task<IActionResult> GetRewards([FromQuery] string search)
        {
            var query = _context.Rewards.Include(r => r.User).AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(r =>
                    r.RewardName.Contains(search)
                    || r.Description.Contains(search)
                    || r.Point.ToString().Contains(search)
                    || r.ExpiryDate.ToString().Contains(search)
                );
            }

            var rewards = await query.OrderByDescending(r => r.Id).ToListAsync();
            return Ok(rewards);
        }

        // GET: api/rewards/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReward(int id)
        {
            var reward = await _context
                .Rewards.Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == id);
            if (reward == null)
                return NotFound();

            return Ok(reward);
        }

        // PUT: api/rewards/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateReward(int id, [FromBody] RewardRequestDto rewardDto)
        {
            var reward = await _context.Rewards.FindAsync(id);
            if (reward == null)
                return NotFound();

            var userId = int.Parse(User.Claims.First(c => c.Type == "userId").Value);
            if (reward.UserId != userId)
                return Forbid();

            reward.RewardName = rewardDto.RewardName;
            reward.Description = rewardDto.Description;
            reward.Point = rewardDto.Point;
            reward.ExpiryDate = rewardDto.ExpiryDate;

            _context.Rewards.Update(reward);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Reward was updated successfully." });
        }

        // DELETE: api/rewards/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteReward(int id)
        {
            var reward = await _context.Rewards.FindAsync(id);
            if (reward == null)
                return NotFound();

            var userId = int.Parse(User.Claims.First(c => c.Type == "userId").Value);
            if (reward.UserId != userId)
                return Forbid();

            _context.Rewards.Remove(reward);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Reward was deleted successfully." });
        }
    }

    public class ApplicationDbContext
    {
        public object Rewards { get; internal set; }
        public object RedeemedRewards { get; internal set; }
        public object Users { get; internal set; }

        internal async Task SaveChangesAsync()
        {
            throw new NotImplementedException();
        }
    }
}
