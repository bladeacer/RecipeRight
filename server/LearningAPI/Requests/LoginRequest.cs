﻿using System.ComponentModel.DataAnnotations;

namespace LearningAPI.Models
{
    public class LoginRequest
    {
        [Required, EmailAddress, MaxLength(50)]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(8), MaxLength(50)]
        public string Password { get; set; } = string.Empty;
        [Required(ErrorMessage = "Recaptcha token is required.")]
        public string RecaptchaToken { get; set; } = string.Empty;

    }
}
