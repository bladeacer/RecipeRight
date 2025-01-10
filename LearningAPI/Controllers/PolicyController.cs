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
    public class PolicyController(MyDbContext context, IMapper mapper, ILogger<ResourceController> logger) : ControllerBase
    {
        [HttpGet, Authorize]
        [ProducesResponseType(typeof(IEnumerable<PoliciesDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll(string? search)
        {
            try
            {
                IQueryable<Policies> result = context.Policies;
                if (search != null)
                {
                    result = result.Where(x => x.PoliciesName.Contains(search) 
                    || x.PoliciesDescription.Contains(search));
                }
                var list = await result.OrderByDescending(x => x.CreatedAt).ToListAsync();
                IEnumerable<PoliciesDTO> data = list.Select(mapper.Map<PoliciesDTO>);
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when get all policies");
                return StatusCode(500);

            }
        }
    }
}
