﻿using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Claims;
using System.Text.Json.Serialization;

namespace LearningAPI.Models
{
    public class User
    {
        public int Id { get; set; }

        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(100), JsonIgnore]
        public string Password { get; set; } = string.Empty;

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }

        [MaxLength(10)]
        public string Gender { get; set; } = string.Empty;

        public string? Image { get; set; }
        public string? ResetToken { get; set; }
        public DateTime? TokenExpiration { get; set; }
        public bool IsTwoFactorEnabled { get; set; } = false; 
        public string? TwoFactorCode { get; set; }            
        public DateTime? TwoFactorExpiry { get; set; }        
        [JsonIgnore]
        public List<UserAttributes>? UserAttributes { get; set; }
        // One user to one Resource
        public List<Resource>? Resource { get; set; }

    }
}