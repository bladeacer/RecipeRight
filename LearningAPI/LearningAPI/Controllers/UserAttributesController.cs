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
    public class UserAttributesController(MyDbContext context, IMapper mapper, ILogger<ResourceController> logger) : ControllerBase
    {
        [HttpGet, Authorize]
        [ProducesResponseType(typeof(UserAttributesDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll(string? search)
        {
            try
            {
                IQueryable<UserAttributes> result = context.UserAttributes;
                if (search != null)
                {
                    result = result.Where(r => r.UserAttributeName.Contains(search)
                    || r.UserAttributeDescription.Contains(search));
                }
                var list = await result.OrderByDescending(x => x.CreatedAt).ToListAsync();
                IEnumerable<UserAttributesDTO> data = list.Select(mapper.Map<UserAttributesDTO>);
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when get all user attributes");
                return StatusCode(500);
            }
        }

        [HttpGet("{id}"), Authorize]
        [ProducesResponseType(typeof(IEnumerable<UserAttributesDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUserAttribute(int id)
        {
            try
            {
                UserAttributes? userAttribute = await context.UserAttributes.FirstOrDefaultAsync(
                    t => t.UserAttributesId == id);
                if (userAttribute == null)
                {
                    return NotFound();
                }
                UserAttributesDTO data = mapper.Map<UserAttributesDTO>(userAttribute);
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when get user attribute by id");
                return StatusCode(500);
            }
        }

        [HttpPost, Authorize]
        [ProducesResponseType(typeof(IEnumerable<UserAttributesDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> AddUserAttribute(UserAttributeRequest userAttribute)
        {
            try
            {
                var now = DateTime.Now;
                var myUserAttribute = new UserAttributes()
                {
                    UserAttributeName = userAttribute.UserAttributeName.Trim(),
                    UserAttributeDescription = userAttribute.UserAttributeDescription.Trim(),
                    CreatedAt = now,
                    UpdatedAt = now,
                    UserId = userAttribute.UserId,
                    AttributeId = userAttribute.AttributeId,
                };
                await context.UserAttributes.AddAsync(myUserAttribute);
                await context.SaveChangesAsync();
                UserAttributesDTO userAttributesDTO = mapper.Map<UserAttributesDTO>(myUserAttribute);
                return Ok(userAttributesDTO);

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when add user attribute");
                return StatusCode(500);
            }
        }

        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> UpdateUserAttribute(int id, UserAttributeRequest userAttribute)
        {
            try
            {
                var myUserAttribute = await context.UserAttributes.FindAsync(id);
                if (myUserAttribute == null)
                {
                    return NotFound();
                }
                if (userAttribute.UserAttributeName != null)
                {
                    myUserAttribute.UserAttributeName = userAttribute.UserAttributeName.Trim();
                }
                if (myUserAttribute.UserAttributeDescription != null)
                {
                    myUserAttribute.UserAttributeDescription = userAttribute.UserAttributeDescription.Trim();
                }
                if (myUserAttribute.AttributeId != 0)
                {
                    myUserAttribute.UserId = userAttribute.UserId;
                }
                myUserAttribute.UpdatedAt = DateTime.Now;
                await context.SaveChangesAsync();
                return Ok();

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when update user attribute");
                return StatusCode(500);
            }
        }
        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteUserAttribute(int id)
        {
            try
            {
                var myUserAttribute = context.UserAttributes.Find(id);
                if (myUserAttribute == null)
                {
                    return NotFound();
                }
                context.UserAttributes.Remove(myUserAttribute);
                await context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when delete user attribute");
                return StatusCode(500);
            }
        }

    }
}
