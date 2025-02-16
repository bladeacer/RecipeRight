using AutoMapper;
using LearningAPI.Models;
using LearningAPI.Requests;
using LearningAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http; // Added for HttpClient
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using ForgotPasswordRequest = LearningAPI.Models.ForgotPasswordRequest;
using LoginRequest = LearningAPI.Models.LoginRequest;
using RegisterRequest = LearningAPI.Models.RegisterRequest;
using ResetPasswordRequest = LearningAPI.Models.ResetPasswordRequest;

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
        [HttpGet, Authorize]
        [ProducesResponseType(typeof(IEnumerable<UserDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll(string? search)
        {
            try
            {
                IQueryable<User> result = context.Users;
                if (search != null)
                {
                    result = result.Where(x => x.Name.Contains(search) || x.Email.Contains(search));
                }
                var list = await result.OrderByDescending(x => x.CreatedAt).ToListAsync();
                IEnumerable<UserDTO> data = list.Select(mapper.Map<UserDTO>);
                return Ok(data);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when get all users");
                return StatusCode(500);
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage));
                return BadRequest(new { message = "Validation Failed", errors });
            }

            try
            {
                // Trim and process user inputs
                request.Name = request.Name.Trim();
                request.Email = request.Email.Trim().ToLower();
                request.Password = request.Password.Trim();

                // Check if the email already exists
                var foundUser = await context.Users.Where(x => x.Email == request.Email).FirstOrDefaultAsync();
                if (foundUser != null)
                {
                    return BadRequest(new { message = "Email already exists." });
                }

                // Hash password and create user object
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

                // Handle image upload
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

                // Save user to the database
                await context.Users.AddAsync(user);
                await context.SaveChangesAsync();

                return Ok(new { message = "User registered successfully!" });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error when registering user");
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

            // --- reCAPTCHA validation for login ---
            if (string.IsNullOrEmpty(request.RecaptchaToken))
            {
                return BadRequest(new { message = "Recaptcha token is missing." });
            }
            if (!await ValidateRecaptchaAsync(request.RecaptchaToken))
            {
                return BadRequest(new { message = "Recaptcha validation failed." });
            }
            // -----------------------------------------

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

                // --- Check if 2FA is enabled ---
                if (foundUser.IsTwoFactorEnabled)
                {
                    var otpCode = new Random().Next(100000, 999999).ToString(); // Generate 6-digit OTP
                    foundUser.TwoFactorCode = otpCode;
                    foundUser.TwoFactorExpiry = DateTime.UtcNow.AddMinutes(10); // OTP valid for 10 mins
                    await context.SaveChangesAsync();

                    // Send OTP to user via email
                    var emailService = HttpContext.RequestServices.GetRequiredService<EmailService>();
                    await emailService.SendEmailAsync(foundUser.Email, "Your 2FA Code", $"Your 2FA code is: {otpCode}");

                    return Ok(new { requires2FA = true, email = foundUser.Email });
                }
                // ---------------------------------

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
                        Image = imageUrl,
                        IsTwoFactorEnabled = user.IsTwoFactorEnabled // Include 2FA state
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

                // Verify current password
                bool verified = BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.Password);
                if (!verified)
                {
                    return BadRequest(new { message = "Current password is incorrect." });
                }

                // Change email
                if (!string.IsNullOrEmpty(request.NewEmail))
                {
                    var existingUser = await context.Users.FirstOrDefaultAsync(u => u.Email == request.NewEmail);
                    if (existingUser != null)
                    {
                        return BadRequest(new { message = "New email is already in use." });
                    }

                    user.Email = request.NewEmail.Trim().ToLower();
                }

                // Change password
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
            // Invalidate the token or perform any necessary logout operations
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

        // --- reCAPTCHA validation helper ---
        private async Task<bool> ValidateRecaptchaAsync(string token)
        {
            var secret = configuration["Recaptcha:SecretKey"];
            using (var client = new HttpClient())
            {
                var values = new Dictionary<string, string>
                {
                    { "secret", secret },
                    { "response", token }
                };

                var content = new FormUrlEncodedContent(values);
                var response = await client.PostAsync("https://www.google.com/recaptcha/api/siteverify", content);
                var jsonString = await response.Content.ReadAsStringAsync();

                using var doc = JsonDocument.Parse(jsonString);
                if (doc.RootElement.TryGetProperty("success", out var successElement))
                {
                    return successElement.GetBoolean();
                }
                return false;
            }
        }
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email.Trim().ToLower());
                if (user == null)
                {
                    return BadRequest(new { message = "Email not found." });
                }

                // Generate reset token and store it
                var resetToken = Guid.NewGuid().ToString();
                user.ResetToken = resetToken;
                user.TokenExpiration = DateTime.UtcNow.AddMinutes(15); // Token valid for 15 mins
                await context.SaveChangesAsync();

                // Encode the email inside the link (so frontend doesn't need the token)
                string encodedEmail = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(user.Email));
                string resetLink = $"http://localhost:3000/resetpassword?email={encodedEmail}";

                // Send email
                var emailService = HttpContext.RequestServices.GetRequiredService<EmailService>();
                await emailService.SendEmailAsync(user.Email, "Reset Your Password",
                    $"<p>Click <a href='{resetLink}'>here</a> to reset your password.</p>");

                return Ok(new { message = "A password reset link has been sent to your email." });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error processing forgot password request");
                return StatusCode(500, new { message = "An error occurred while processing the request." });
            }
        }


        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Decode email from request
                string decodedEmail = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(request.Email));

                // Find user by email
                var user = await context.Users.FirstOrDefaultAsync(u => u.Email == decodedEmail);
                if (user == null || user.ResetToken == null || user.TokenExpiration < DateTime.UtcNow)
                {
                    return BadRequest(new { message = "Invalid or expired reset request." });
                }

                // Update password
                user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                user.ResetToken = null;
                user.TokenExpiration = null;

                // Save changes
                await context.SaveChangesAsync();

                return Ok(new { message = "Your password has been reset successfully. You can now log in." });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error resetting password");
                return StatusCode(500, new { message = "An error occurred while resetting the password." });
            }
        }

        public class TwoFactorToggleRequest
        {
            public bool Enable { get; set; }
        }

        [HttpPost("enable-2fa")]
        [Authorize]
        public async Task<IActionResult> EnableTwoFactor([FromBody] TwoFactorToggleRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Invalid request." });
            }

            var userId = Convert.ToInt32(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
            var user = await context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            user.IsTwoFactorEnabled = request.Enable;
            await context.SaveChangesAsync();

            return Ok(new { message = request.Enable ? "2FA enabled." : "2FA disabled." });
        }

        [HttpPost("verify-2fa")]
        public async Task<IActionResult> VerifyTwoFactor([FromBody] Models.TwoFactorRequest request)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || user.TwoFactorCode != request.Code || user.TwoFactorExpiry < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Invalid or expired OTP." });
            }

            // Clear OTP after successful verification
            user.TwoFactorCode = null;
            user.TwoFactorExpiry = null;
            await context.SaveChangesAsync();

            // Generate JWT token and return
            string accessToken = CreateToken(user);
            return Ok(new { accessToken });
        }
        [HttpPost("resend-2fa")]
        public async Task<IActionResult> ResendTwoFactor([FromBody] ResendTwoFactorRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Email))
                {
                    logger.LogWarning("⚠ Email is missing in the request.");
                    return BadRequest(new { message = "Email is required for resending OTP." });
                }

                var user = await context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());
                if (user == null)
                {
                    return NotFound(new { message = "User not found or 2FA is not enabled." });
                }

                // Generate a new OTP
                var newOtp = new Random().Next(100000, 999999).ToString();
                logger.LogInformation($"✅ Generated new OTP: {newOtp} for {request.Email}");

                // Save new OTP to database
                user.TwoFactorCode = newOtp;
                user.TwoFactorExpiry = DateTime.UtcNow.AddMinutes(5);
                await context.SaveChangesAsync();
                logger.LogInformation($"✅ OTP updated in DB: {user.TwoFactorCode}, New Expiry: {user.TwoFactorExpiry}");

                // ✅ Use the same email service as login
                var emailService = HttpContext.RequestServices.GetRequiredService<EmailService>();
                await emailService.SendEmailAsync(user.Email, "Your 2FA Code", $"Your new OTP code is: {newOtp}");

                return Ok(new { message = "OTP sent successfully." });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "❌ Error resending OTP.");
                return StatusCode(500, new { message = "An error occurred while resending the OTP." });
            }
        }

    }
}
