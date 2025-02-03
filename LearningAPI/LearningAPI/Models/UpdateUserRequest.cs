using System.ComponentModel.DataAnnotations;

namespace LearningAPI.Models
{
    public class UpdateUserRequest
    {
        [Required, MinLength(3), MaxLength(50)]
        [RegularExpression(@"^[a-zA-Z '-,.]+$", ErrorMessage = "Only allow letters, spaces and characters: ' - , .")]
        public string Name { get; set; }


        [MaxLength(10)]
        public string Gender { get; set; }

        public IFormFile? Image { get; set; }
    }
}
