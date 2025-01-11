using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LearningAPI.Models;

namespace LearningAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ResourceTypeController(MyDbContext context, IMapper mapper, ILogger<ResourceController> logger) : ControllerBase
    {
        [HttpGet, Authorize]
        [ProducesResponseType(typeof(IEnumerable<ResourceTypeDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll(string? search)
        {
            try
            {
                IQueryable<ResourceType> result = context.ResourceTypes;
                if (search != null)
                {
                    result = result.Where(x => x.TypeName.Contains(search) || x.ResourceTypeDescription.Contains(search));
                }
                var list = await result.OrderByDescending(x => x.CreatedAt).ToListAsync();
                IEnumerable<ResourceTypeDTO> data = list.Select(mapper.Map<ResourceTypeDTO>);
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when get all resource types");
                return StatusCode(500);
            }
        }
        [HttpGet("{id}"), Authorize]
        [ProducesResponseType(typeof(IEnumerable<ResourceTypeDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetResourceType(int id)
        {
            try
            {
                ResourceType? resourceType = await context.ResourceTypes.FirstOrDefaultAsync(t => t.ResourceTypeId == id);
                if (resourceType == null)
                {
                    return NotFound();
                }
                ResourceTypeDTO data = mapper.Map<ResourceTypeDTO>(resourceType);
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when get resource type by id");
                return StatusCode(500);
            }
        }
        [HttpPost, Authorize]
        [ProducesResponseType(typeof(IEnumerable<ResourceTypeDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> AddResourceType(ResourceTypeRequest resourceType)
        {
            try
            {
                var now = DateTime.Now;
                var myResourceType = new ResourceType()
                {
                    TypeName = resourceType.TypeName.Trim(),
                    ResourceTypeDescription = resourceType.ResourceTypeDescription.Trim(),
                    CreatedAt = now,
                    UpdatedAt = now
                };
                await context.ResourceTypes.AddAsync(myResourceType);
                await context.SaveChangesAsync();
                ResourceTypeDTO resourceTypeDTO = mapper.Map<ResourceTypeDTO>(myResourceType);
                return Ok(resourceTypeDTO);

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when add resource type");
                return StatusCode(500);
            }
        }
        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> UpdateResourceType(int id, ResourceTypeRequest resourceType)
        {
            
            try
            {
                var myResourceType = await context.ResourceTypes.FindAsync(id);
                if (myResourceType == null)
                {
                    return NotFound();
                }
                if (resourceType.TypeName != null)
                {
                    myResourceType.TypeName = resourceType.TypeName.Trim();
                }
                if (resourceType.ResourceTypeDescription != null)
                {
                    myResourceType.ResourceTypeDescription = resourceType.ResourceTypeDescription.Trim();
                }
                myResourceType.UpdatedAt = DateTime.Now;

                await context.SaveChangesAsync();
                return Ok();

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when update resourceType");
                return StatusCode(500);
            }
        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteResourceType(int id) 
        {
            try
            {
                var myResourceType = context.ResourceTypes.Find(id);
                if (myResourceType == null)
                {
                    return NotFound();
                }

                context.ResourceTypes.Remove(myResourceType);
                await context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when delete resource");
                return StatusCode(500);
            }
        }


    }
}
