using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;


namespace LearningAPI.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required, MinLength(3), MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(100), JsonIgnore]
        public string Password { get; set; } = string.Empty;

        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }

        // Navigation property to represent the one-to-many relationship
        // One user to many tutorial
        //[JsonIgnore]
        //public List<Tutorial>? Tutorials { get; set; }
        // One user to many UserAttributes
        [JsonIgnore]
        public List<UserAttributes>? UserAttributes { get; set; }
        // One user to one Resource
        public List<Resource>? Resource { get; set; }
    }

    public class Resource
    {
        public int ResourceId { get; set; }
        [Required, MinLength(3), MaxLength(50)]
        public string ResourceName { get; set; } = string.Empty;
        [MaxLength(500)]
        public string ResourceDescription { get; set; } = string.Empty;
        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }
        public int ResourceTypeId { get; set; }
        // Who owns the resource
        public int UserId { get; set; }

        public ResourceType? ResourceType { get; set; }
        public User? User { get; set; }

    }

    // TODO: ResourceTypeName must be unique
    public class ResourceType
    {
        public int ResourceTypeId { get; set; }

        [Required, MinLength(3), MaxLength(50)]
        public string TypeName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string ResourceTypeDescription { get; set; } = string.Empty;
        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }
        // One Resource to one ResourceType
        public List<Resource>? Resource { get; set; }

    }

    public class Attributes
    {
        public int AttributesId { get; set; }
        [Required, MinLength(3), MaxLength(50)]
        public string AttributeName { get; set; } = string.Empty;
        [MaxLength(500)]
        public string AttributeDescription { get; set; } = string.Empty;
        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }
        public List<UserAttributes>? UserAttributes { get; set; }
    }

    // Assign attributes to users
    public class UserAttributes
    {
        public int UserAttributesId { get; set; }
        [Required, MinLength(3), MaxLength(50)]
        public string UserAttributeName { get; set; } = string.Empty;
        [MaxLength(500)]
        public string UserAttributeDescription { get; set; } = string.Empty;
        [Column(TypeName = "datetime")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime UpdatedAt { get; set; }
        public int AttributeId { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public Attributes? Attribute { get; set; }
    }

}
