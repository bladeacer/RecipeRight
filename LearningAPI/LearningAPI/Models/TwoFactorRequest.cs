﻿namespace LearningAPI.Models
{
    public class TwoFactorRequest
    {
            public string Email { get; set; } = string.Empty;
            public string Code { get; set; } = string.Empty;

    }
}
