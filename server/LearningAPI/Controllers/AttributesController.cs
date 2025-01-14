using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LearningAPI.Models;
namespace LearningAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AttributesController(MyDbContext context, IMapper mapper, ILogger<ResourceController> logger) : ControllerBase
    {
        [HttpGet, Authorize]
        [ProducesResponseType(typeof(IEnumerable<AttributesDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll(string? search)
        {
            try
            {
                IQueryable<Attributes> result = context.Attributes;
                if (search != null)
                {
                    result = result.Where(x => x.AttributeName.Contains(search)
                    || x.AttributeDescription.Contains(search));
                }
                var list = await result.OrderByDescending(x => x.CreatedAt).ToListAsync();
                IEnumerable<AttributesDTO> data = list.Select(mapper.Map<AttributesDTO>);
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when get all attributes");
                return StatusCode(500);
            }
        }
        [HttpGet("{id}"), Authorize]
        [ProducesResponseType(typeof(IEnumerable<AttributesDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAttribute(int id)
        {
            try
            {
                Attributes? attribute = await context.Attributes.FirstOrDefaultAsync(t => t.AttributesId == id);
                if (attribute == null)
                {
                    return NotFound();
                }
                AttributesDTO data = mapper.Map<AttributesDTO>(attribute);
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when get attribute by id");
                return StatusCode(500);
            }
        }
        [HttpPost, Authorize]
        [ProducesResponseType(typeof(IEnumerable<AttributesDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> AddAttribute(AttributeRequest attribute)
        {
            try
            {
                var now = DateTime.Now;
                var myAttribute = new Attributes()
                {
                    AttributeName = attribute.AttributeName.Trim(),
                    AttributeDescription = attribute.AttributeDescription.Trim(),
                    CreatedAt = now,
                    UpdatedAt = now,
                };
                await context.Attributes.AddAsync(myAttribute);
                await context.SaveChangesAsync();
                AttributesDTO attributesDTO = mapper.Map<AttributesDTO>(myAttribute);
                return Ok(attributesDTO);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when add attribute");
                return StatusCode(500);
            }

        }
        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> UpdateAttribute(int id, AttributeRequest attribute)
        {
            try
            {
                var myAttribute = await context.Attributes.FindAsync(id);
                if (myAttribute == null)
                {
                    return NotFound();
                }
                if (attribute.AttributeName != null)
                {
                    myAttribute.AttributeName = attribute.AttributeName.Trim();
                }
                if (attribute.AttributeDescription != null)
                {
                    myAttribute.AttributeDescription = attribute.AttributeDescription.Trim();
                }
                myAttribute.UpdatedAt = DateTime.Now;
                await context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when updating attribute");
                return StatusCode(500);
            }

        }

        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteAttribute(int id) 
        {
            try
            {
                var myAttribute = context.Attributes.Find(id);
                if (myAttribute == null)
                {
                    return NotFound();
                }

                context.Attributes.Remove(myAttribute);
                await context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when delete attribute");
                return StatusCode(500);
            }
        }

    }
}
