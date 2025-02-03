using AutoMapper;
using LearningAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LearningAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TutorialController(MyDbContext context, IMapper mapper,
        ILogger<TutorialController> logger) : ControllerBase
    {
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<TutorialDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll(string? search)
        {
            try
            {
                IQueryable<Tutorial> result = context.Tutorials.Include(t => t.User);
                if (search != null)
                {
                    result = result.Where(x => x.Title.Contains(search)
                        || x.Description.Contains(search));
                }
                var list = await result.OrderByDescending(x => x.CreatedAt).ToListAsync();
                IEnumerable<TutorialDTO> data = list.Select(mapper.Map<TutorialDTO>);
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when get all tutorials");
                return StatusCode(500);
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(TutorialDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetTutorial(int id)
        {
            try
            {
                Tutorial? tutorial = await context.Tutorials.Include(t => t.User)
                .SingleOrDefaultAsync(t => t.Id == id);
                if (tutorial == null)
                {
                    return NotFound();
                }
                TutorialDTO data = mapper.Map<TutorialDTO>(tutorial);
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when get tutorial by id");
                return StatusCode(500);
            }
        }

        [HttpPost, Authorize]
        [ProducesResponseType(typeof(TutorialDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> AddTutorial(AddTutorialRequest tutorial)
        {
            try
            {
                int userId = GetUserId();
                var now = DateTime.Now;
                var myTutorial = new Tutorial()
                {
                    Title = tutorial.Title.Trim(),
                    Description = tutorial.Description.Trim(),
                    ImageFile = tutorial.ImageFile,
                    CreatedAt = now,
                    UpdatedAt = now,
                    UserId = userId
                };

                await context.Tutorials.AddAsync(myTutorial);
                await context.SaveChangesAsync();

                Tutorial? newTutorial = context.Tutorials.Include(t => t.User)
                    .FirstOrDefault(t => t.Id == myTutorial.Id);
                TutorialDTO tutorialDTO = mapper.Map<TutorialDTO>(newTutorial);
                return Ok(tutorialDTO);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when add tutorial");
                return StatusCode(500);
            }
        }

        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> UpdateTutorial(int id, UpdateTutorialRequest tutorial)
        {
            try
            {
                var myTutorial = await context.Tutorials.FindAsync(id);
                if (myTutorial == null)
                {
                    return NotFound();
                }

                int userId = GetUserId();
                if (myTutorial.UserId != userId)
                {
                    return Forbid();
                }

                if (tutorial.Title != null)
                {
                    myTutorial.Title = tutorial.Title.Trim();
                }
                if (tutorial.Description != null)
                {
                    myTutorial.Description = tutorial.Description.Trim();
                }
                if (tutorial.ImageFile != null)
                {
                    myTutorial.ImageFile = tutorial.ImageFile;
                }
                myTutorial.UpdatedAt = DateTime.Now;

                await context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when update tutorial");
                return StatusCode(500);
            }
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteTutorial(int id)
        {
            try
            {
                var myTutorial = context.Tutorials.Find(id);
                if (myTutorial == null)
                {
                    return NotFound();
                }

                int userId = GetUserId();
                if (myTutorial.UserId != userId)
                {
                    return Forbid();
                }

                context.Tutorials.Remove(myTutorial);
                await context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when delete tutorial");
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
