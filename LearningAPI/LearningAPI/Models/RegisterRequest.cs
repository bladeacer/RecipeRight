using System.ComponentModel.DataAnnotations;

namespace LearningAPI.Models
{
    public class RegisterRequest
    {
        [Required, MinLength(3), MaxLength(50)]
        [RegularExpression(@"^[a-zA-Z '-,.]+$", ErrorMessage = "Only allow letters, spaces and characters: ' - , .")]
        public string Name { get; set; } = string.Empty;

        [Required, EmailAddress, MaxLength(50)]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(8), MaxLength(50)]
        [RegularExpression(@"^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$", ErrorMessage = "At least 1 letter and 1 number")]
        public string Password { get; set; } = string.Empty;

        public string Gender { get; set; } = string.Empty;
        public IFormFile? Image { get; set; }

        [Required(ErrorMessage = "Recaptcha token is required.")]
        public string RecaptchaToken { get; set; } = string.Empty;
    }
}
