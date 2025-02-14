
namespace LearningAPI.Models
{
    public class UserDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string? Image { get; set; }

        public string Role { get; set; } = string.Empty;

        public bool IsTwoFactorEnabled { get; set; }
       
    }
}
