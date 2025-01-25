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
    public class ResourceController(MyDbContext context, IMapper mapper, ILogger<ResourceController> logger) : ControllerBase
    {
        [HttpGet, Authorize]
        [ProducesResponseType(typeof(IEnumerable<ResourceDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll(string? search)
        {
            try
            {
                IQueryable<Resource> result = context.Resources.Include(r => r.User);
                if (search != null)
                {
                    result = result.Where(x => x.ResourceName.Contains(search) 
                    || x.ResourceDescription.Contains(search));
                }
                var list = await result.OrderByDescending(x => x.CreatedAt).ToListAsync();
                IEnumerable<ResourceDTO> data = list.Select(mapper.Map<ResourceDTO>);
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when get all resources");
                return StatusCode(500);
            }
        }
        [HttpGet("{id}"), Authorize]
        [ProducesResponseType(typeof(IEnumerable<ResourceDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetResource(int id)
        {
            try
            {
                Resource? resource = await context.Resources.Include(t => t.User).SingleOrDefaultAsync(t => t.ResourceId == id);
                if (resource == null)
                {
                    return NotFound();
                }
                ResourceDTO data = mapper.Map<ResourceDTO>(resource);
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when get resources by id");
                return StatusCode(500);

            }
        }
        [HttpPost, Authorize]
        [ProducesResponseType(typeof(ResourceDTO), StatusCodes.Status200OK)]

        public async Task<IActionResult> AddResource(ResourceRequest resource)
        {
            try
            {
                int userId = GetUserId();
                var now = DateTime.Now;
                var myResource = new Resource()
                {
                    ResourceName = resource.ResourceName.Trim(),
                    ResourceDescription = resource.ResourceDescription.Trim(),
                    CreatedAt = now,
                    UpdatedAt = now,
                    UserId = userId,
                    ResourceTypeId = resource.ResourceTypeId
                };
                var foundResource = await context.Resources.Where(x => x.ResourceName == resource.ResourceName).FirstOrDefaultAsync();
                if (foundResource != null)
                {
                    string message = "Resource name already exists";
                    return BadRequest(new { message });
                }

                await context.Resources.AddAsync(myResource);
                await context.SaveChangesAsync();
                Resource? newResource = context.Resources.Include(t => t.User).FirstOrDefault(t => t.UserId == myResource.UserId);
                ResourceDTO resourceDTO = mapper.Map<ResourceDTO>(newResource);
                return Ok(resourceDTO);

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when add resource");
                return StatusCode(500);
            }
        }
        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> UpdateResource(int id, ResourceRequest resource)
        {
            try
            {
                var myResource = await context.Resources.FindAsync(id);
                if (myResource == null)
                {
                    return NotFound();
                }
                int userId = GetUserId();
                if (myResource.UserId != userId)
                {
                    return Forbid();
                }
                var foundResource = await context.Resources.Where(x => x.ResourceName == resource.ResourceName).FirstOrDefaultAsync();
                if (foundResource != null)
                {
                    string message = "Resource name already exists";
                    return BadRequest(new { message });
                }
                if (resource.ResourceName != null)
                {
                    myResource.ResourceName = resource.ResourceName.Trim();
                }
                if (resource.ResourceDescription != null)
                {
                    myResource.ResourceDescription = resource.ResourceDescription.Trim();
                }
                myResource.UpdatedAt = DateTime.Now;

                myResource.ResourceTypeId = resource.ResourceTypeId;

                await context.SaveChangesAsync();
                return Ok();

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when update resource");
                return StatusCode(500);
            }
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteResource(int id) 
        {
            try
            {
                var myResource = context.Resources.Find(id);
                if (myResource == null)
                {
                    return NotFound();
                }

                int userId = GetUserId();
                if (myResource.UserId != userId)
                {
                    return Forbid();
                }

                context.Resources.Remove(myResource);
                await context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when delete resource");
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
