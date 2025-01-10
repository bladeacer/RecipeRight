using AutoMapper;
using LearningAPI.Models;
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
    public class UserController(MyDbContext context, IConfiguration configuration, IMapper mapper,
        ILogger<UserController> logger) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            try
            {
                // Trim string values
                request.Name = request.Name.Trim();
                request.Email = request.Email.Trim().ToLower();
                request.Password = request.Password.Trim();

                // Check email
                var foundUser = await context.Users.Where(x => x.Email == request.Email).FirstOrDefaultAsync();
                if (foundUser != null)
                {
                    string message = "Email already exists.";
                    return BadRequest(new { message });
                }

                // Create user object
                var now = DateTime.Now;
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
                var user = new User()
                {
                    Name = request.Name,
                    Email = request.Email,
                    Password = passwordHash,
                    CreatedAt = now,
                    UpdatedAt = now
                };

                // Add user
                await context.Users.AddAsync(user);
                await context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when user register");
                return StatusCode(500);
            }
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            try
            {
                // Trim string values
                request.Email = request.Email.Trim().ToLower();
                request.Password = request.Password.Trim();

                // Check email and password
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

                // Return user info
                UserDTO userDTO = mapper.Map<UserDTO>(foundUser);
                string accessToken = CreateToken(foundUser);
                LoginResponse response = new() { User = userDTO, AccessToken = accessToken };
                return Ok(response);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when user login");
                return StatusCode(500);
            }
        }

        [HttpGet("auth"), Authorize]
        [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
        public IActionResult Auth()
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
                    UserDTO userDTO = new() { Id = id, Name = name, Email = email };
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
                return StatusCode(500);
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
                Subject = new ClaimsIdentity(
                [
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Email, user.Email)
                ]),
                Expires = DateTime.UtcNow.AddDays(tokenExpiresDays),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            string token = tokenHandler.WriteToken(securityToken);

            return token;
        }
    }
}