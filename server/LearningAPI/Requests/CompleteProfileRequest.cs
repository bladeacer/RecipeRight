using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace LearningAPI.Requests
{
    public class CompleteProfileRequest
    {
        [Required(ErrorMessage = "Name is required.")]
        [MinLength(3)]
        public string Name { get; set; }

        [Required(ErrorMessage = "Gender is required.")]
        public string Gender { get; set; }

        public IFormFile? Image { get; set; }
    }
}
