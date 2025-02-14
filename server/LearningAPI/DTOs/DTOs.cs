using System.Text.Json.Serialization;
namespace LearningAPI.Models
{
    public class ResourceDTO
    {
        public int ResourceId { get; set; }
        public string ResourceName { get; set; } = string.Empty;
        public string ResourceDescription { get; set; } = string.Empty;
        public int ResourceTypeId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int UserId { get; set; }
        public UserDTO? User { get; set; }
        public ResourceTypeDTO? ResourceType { get; set; }
    }
    public class ResourceTypeDTO
    {
        public int ResourceTypeId { get; set; }
        public string TypeName { get; set; } = string.Empty;
        public string ResourceTypeDescription { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public ResourceDTO? Resource { get; set; }
    }

    public class AttributesDTO
    {
        public int AttributesId { get; set; }
        public string AttributeName { get; set; } = string.Empty;
        public string AttributeDescription {  get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
    public class UserAttributesDTO
    {
        public int UserAttributesId { get; set; } 
        public string UserAttributeName {  get; set; } = string.Empty;
        public string UserAttributeDescription { get; set; } = string.Empty;
        public int AttributeId { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public UserDTO? User { get; set; }
        public AttributesDTO? Attributes { get; set; }

    }
}
