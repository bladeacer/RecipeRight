using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LearningAPI.Models;
using System.Security.Claims;

namespace LearningAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SustainabilityGoalController(MyDbContext context, IMapper mapper, ILogger<SustainabilityGoalController> logger) : ControllerBase
    {
        [HttpGet, Authorize]
        [ProducesResponseType(typeof(IEnumerable<SustainabilityGoalDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll(string? search)
        {
            try
            {
                IQueryable<SustainabilityGoal> result = context.SustainabilityGoals.Include(g => g.User);
                if (search != null)
                {
                    result = result.Where(x => x.GoalName.Contains(search));
                }
                var list = await result.OrderByDescending(x => x.CreatedOn).ToListAsync();
                IEnumerable<SustainabilityGoalDTO> data = list.Select(mapper.Map<SustainabilityGoalDTO>);
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error getting all sustainability goals");
                return StatusCode(500);
            }
        }

        [HttpGet("{id}"), Authorize]
        [ProducesResponseType(typeof(SustainabilityGoalDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetGoal(int id)
        {
            try
            {
                SustainabilityGoal? goal = await context.SustainabilityGoals.Include(g => g.User).SingleOrDefaultAsync(g => g.SustainabilityGoalId == id);
                if (goal == null)
                {
                    return NotFound();
                }
                SustainabilityGoalDTO data = mapper.Map<SustainabilityGoalDTO>(goal);
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error getting sustainability goal by ID");
                return StatusCode(500);
            }
        }

        [HttpPost, Authorize]
        [ProducesResponseType(typeof(SustainabilityGoalDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> AddGoal(SustainabilityGoalRequest goalRequest)
        {
            try
            {
                int userId = GetUserId();
                var now = DateTime.Now;
                var goal = new SustainabilityGoal()
                {
                    GoalName = goalRequest.GoalName.Trim(),
                    GoalDescription = goalRequest.GoalDescription.Trim(),
                    TargetValue = goalRequest.TargetValue,
                    CurrentValue = goalRequest.CurrentValue,
                    Deadline = goalRequest.Deadline,
                    CreatedOn = now,
                    UserId = userId
                };
                await context.SustainabilityGoals.AddAsync(goal);
                await context.SaveChangesAsync();
                SustainabilityGoal? newGoal = context.SustainabilityGoals.Include(g => g.User).FirstOrDefault(g => g.SustainabilityGoalId == goal.SustainabilityGoalId);
                SustainabilityGoalDTO goalDTO = mapper.Map<SustainabilityGoalDTO>(newGoal);
                return Ok(goalDTO);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error adding sustainability goal");
                return StatusCode(500);
            }
        }

        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> UpdateGoal(int id, SustainabilityGoalRequest goalRequest)
        {
            try
            {
                var goal = await context.SustainabilityGoals.FindAsync(id);
                if (goal == null)
                {
                    return NotFound();
                }
                int userId = GetUserId();
                if (goal.UserId != userId)
                {
                    return Forbid();
                }
                if (!string.IsNullOrEmpty(goalRequest.GoalName))
                {
                    goal.GoalName = goalRequest.GoalName.Trim();
                }
                if (!string.IsNullOrEmpty(goalRequest.GoalDescription))
                {
                    goal.GoalDescription = goalRequest.GoalDescription.Trim();
                }
                goal.TargetValue = goalRequest.TargetValue;
                goal.CurrentValue = goalRequest.CurrentValue;
                goal.Deadline = goalRequest.Deadline;
                await context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error updating sustainability goal");
                return StatusCode(500);
            }
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteGoal(int id)
        {
            try
            {
                var goal = context.SustainabilityGoals.Find(id);
                if (goal == null)
                {
                    return NotFound();
                }

                int userId = GetUserId();
                if (goal.UserId != userId)
                {
                    return Forbid();
                }

                context.SustainabilityGoals.Remove(goal);
                await context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error deleting sustainability goal");
                return StatusCode(500);
            }
        }

        private int GetUserId()
        {
            return Convert.ToInt32(User.Claims
                .Where(c => c.Type == ClaimTypes.NameIdentifier)
                .Select(c => c.Value).SingleOrDefault());
        }
    }
}
