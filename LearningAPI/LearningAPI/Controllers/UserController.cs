using AutoMapper;
using LearningAPI.Models;
using LearningAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LearningAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly MyDbContext context;
        private readonly IConfiguration configuration;
        private readonly IMapper mapper;
        private readonly ILogger<UserController> logger;

        public UserController(MyDbContext context, IConfiguration configuration, IMapper mapper, ILogger<UserController> logger)
        {
            this.context = context;
            this.configuration = configuration;
            this.mapper = mapper;
            this.logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                
                request.Name = request.Name.Trim();
                request.Email = request.Email.Trim().ToLower();
                request.Password = request.Password.Trim();

                var foundUser = await context.Users.Where(x => x.Email == request.Email).FirstOrDefaultAsync();
                if (foundUser != null)
                {
                    return BadRequest(new { message = "Email already exists." });
                }

                var now = DateTime.Now;
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
                var user = new User()
                {
                    Name = request.Name,
                    Email = request.Email,
                    Password = passwordHash,
                    CreatedAt = now,
                    UpdatedAt = now,
                    Gender = request.Gender
                };

                if (request.Image != null)
                {
                    var uniqueFileName = $"{Guid.NewGuid()}_{request.Image.FileName}";
                    var imagePath = Path.Combine("wwwroot/images", uniqueFileName);
                    Directory.CreateDirectory(Path.GetDirectoryName(imagePath)); 
                    using (var stream = new FileStream(imagePath, FileMode.Create))
                    {
                        await request.Image.CopyToAsync(stream);
                    }
                    user.Image = uniqueFileName; 
                }

                await context.Users.AddAsync(user);
                await context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when user register");
                return StatusCode(500, new { message = "An error occurred while registering the user." });
            }
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                request.Email = request.Email.Trim().ToLower();
                request.Password = request.Password.Trim();

                string message = "Email or password is not correct.";
                var foundUser = await context.Users.Where(x => x.Email == request.Email).FirstOrDefaultAsync();
                if (foundUser == null)
                {
                    return BadRequest(new { message });
                }
                bool verified = BCrypt.Net.BCrypt.Verify(request.Password, foundUser.Password);
                if (!verified)
                {
                    return BadRequest(new { message });
                }

                UserDTO userDTO = mapper.Map<UserDTO>(foundUser);
                string accessToken = CreateToken(foundUser);
                LoginResponse response = new() { User = userDTO, AccessToken = accessToken };
                return Ok(response);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when user login");
                return StatusCode(500, new { message = "An error occurred while logging in." });
            }
        }

        [HttpGet("auth"), Authorize]
        [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
        public async Task<IActionResult> Auth()
        {
            try
            {
                var id = Convert.ToInt32(User.Claims.Where(c => c.Type == ClaimTypes.NameIdentifier)
                    .Select(c => c.Value).SingleOrDefault());
                var name = User.Claims.Where(c => c.Type == ClaimTypes.Name)
                    .Select(c => c.Value).SingleOrDefault();
                var email = User.Claims.Where(c => c.Type == ClaimTypes.Email)
                    .Select(c => c.Value).SingleOrDefault();

                if (id != 0 && name != null && email != null)
                {
                    var user = await context.Users.FindAsync(id);
                    if (user == null)
                    {
                        return Unauthorized();
                    }

                    string baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
                    string? imageUrl = user.Image != null ? $"{baseUrl}/images/{user.Image}" : null;

                    UserDTO userDTO = new()
                    {
                        Id = user.Id,
                        Name = user.Name,
                        Email = user.Email,
                        Gender = user.Gender,
                        Image = imageUrl
                    };

                    AuthResponse response = new() { User = userDTO };
                    return Ok(response);
                }
                else
                {
                    return Unauthorized();
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when user auth");
                return StatusCode(500, new { message = "An error occurred while authenticating the user." });
            }
        }

        private string CreateToken(User user)
        {
            string? secret = configuration.GetValue<string>("Authentication:Secret");
            if (string.IsNullOrEmpty(secret))
            {
                throw new Exception("Secret is required for JWT authentication.");
            }

            int tokenExpiresDays = configuration.GetValue<int>("Authentication:TokenExpiresDays");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role) 

                }),
                Expires = DateTime.UtcNow.AddDays(tokenExpiresDays),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            string token = tokenHandler.WriteToken(securityToken);

            return token;
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateUser(int id, [FromForm] UpdateUserRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = await context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "User not found." });
                }

                user.Name = request.Name.Trim();
                user.Gender = request.Gender;
                user.UpdatedAt = DateTime.Now;

                if (request.Image != null)
                {
                    var uniqueFileName = $"{Guid.NewGuid()}_{request.Image.FileName}";
                    var imagePath = Path.Combine("wwwroot/images", uniqueFileName);
                    Directory.CreateDirectory(Path.GetDirectoryName(imagePath));
                    using (var stream = new FileStream(imagePath, FileMode.Create))
                    {
                        await request.Image.CopyToAsync(stream);
                    }
                    user.Image = uniqueFileName;
                }

                context.Users.Update(user);
                await context.SaveChangesAsync();
                return Ok(new { message = "User profile updated successfully." });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when updating user profile");
                return StatusCode(500, new { message = "An error occurred while updating the user profile." });
            }
        }

        [HttpPut("change-security")]
        [Authorize]
        public async Task<IActionResult> ChangeSecurity([FromForm] ChangeSecurityRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userId = Convert.ToInt32(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
                var user = await context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found." });
                }

                bool verified = BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.Password);
                if (!verified)
                {
                    return BadRequest(new { message = "Current password is incorrect." });
                }

                if (!string.IsNullOrEmpty(request.NewEmail))
                {
                    var existingUser = await context.Users.FirstOrDefaultAsync(u => u.Email == request.NewEmail);
                    if (existingUser != null)
                    {
                        return BadRequest(new { message = "New email is already in use." });
                    }

                    user.Email = request.NewEmail.Trim().ToLower();
                }

                if (!string.IsNullOrEmpty(request.NewPassword))
                {
                    if (BCrypt.Net.BCrypt.Verify(request.NewPassword, user.Password))
                    {
                        return BadRequest(new { message = "New password cannot be the same as the current password." });
                    }

                    user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                }

                user.UpdatedAt = DateTime.Now;
                context.Users.Update(user);
                await context.SaveChangesAsync();
                return Ok(new { message = "Security settings updated successfully." });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when changing security settings");
                return StatusCode(500, new { message = "An error occurred while updating security settings." });
            }
        }
        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            return Ok(new { message = "User logged out successfully." });
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "User not found." });
                }

                context.Users.Remove(user);
                await context.SaveChangesAsync();
                return Ok(new { message = "User deleted successfully." });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when deleting user");
                return StatusCode(500, new { message = "An error occurred while deleting the user." });
            }
        }
        
    }
}
