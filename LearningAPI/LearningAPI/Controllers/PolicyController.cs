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
        [HttpGet("{id}"), Authorize]
        [ProducesResponseType(typeof(IEnumerable<PoliciesDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetPolicy(int id)
        {
            try
            {
                Policies? policy = await context.Policies.FirstOrDefaultAsync(t => t.PoliciesId == id);
                if (policy == null)
                {
                    return NotFound();
                }
                PoliciesDTO data = mapper.Map<PoliciesDTO>(policy);
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when get policy by id");
                return StatusCode(500);
            }
        }

        [HttpPost, Authorize]
        [ProducesResponseType(typeof(IEnumerable<PoliciesDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> AddPolicy(PolicyRequest policy)
        {
            try
            {
                var now = DateTime.Now;
                var myPolicy = new Policies()
                {
                    PoliciesName = policy.PoliciesName.Trim(),
                    PoliciesDescription = policy.PoliciesDescription.Trim(),
                    CreatedAt = now,
                    UpdatedAt = now,
                    ResourceTypeId = policy.ResourceTypeId,
                    ResourceId = policy.ResourceId,
                    RequiredAttributes = policy.RequiredAttributes,
                };
                await context.Policies.AddAsync(myPolicy);
                await context.SaveChangesAsync();
                PoliciesDTO policyDTO = mapper.Map<PoliciesDTO>(myPolicy);
                return Ok(policyDTO);

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when add policy");
                return StatusCode(500);
            }
        }

        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> UpdatePolicy(int id, PolicyRequest policy)
        {

            try
            {
                var myPolicy = await context.Policies.FindAsync(id);
                if (myPolicy == null)
                {
                    return NotFound();
                }
                if (policy.PoliciesName != null)
                {
                    myPolicy.PoliciesName = policy.PoliciesName.Trim();
                }
                if (policy.PoliciesDescription != null)
                {
                    myPolicy.PoliciesDescription = policy.PoliciesDescription.Trim();
                }
                if (policy.RequiredAttributes != null)
                {
                    myPolicy.RequiredAttributes = policy.RequiredAttributes;
                }
                myPolicy.UpdatedAt = DateTime.Now;

                await context.SaveChangesAsync();
                return Ok();

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when update policy");
                return StatusCode(500);
            }
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeletePolicy(int id) 
        {
            try
            {
                var myPolicy = context.Policies.Find(id);
                if (myPolicy == null)
                {
                    return NotFound();
                }

                context.Policies.Remove(myPolicy);
                await context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when delete policy");
                return StatusCode(500);
            }
        }
    }
}
