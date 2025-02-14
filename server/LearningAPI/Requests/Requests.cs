using System.ComponentModel.DataAnnotations;

namespace LearningAPI.Models
{

    public class ResourceTypeRequest
    {
        [Required, MinLength(3), MaxLength(50)]
        public string TypeName { get; set; } = string.Empty;
        [MaxLength(500)]
        public string ResourceTypeDescription { get; set; } = string.Empty;

    }
    public class ResourceRequest
    {
        public int ResourceTypeId { get; set; } 
        [Required, MinLength(3), MaxLength(50)]
        public string ResourceName { get; set; } = string.Empty;
        [MaxLength(500)]
        public string ResourceDescription { get; set; } = string.Empty;
    }
    public class AttributeRequest
    {

        [Required, MinLength(3), MaxLength(50)]
        public string AttributeName { get; set; } = string.Empty;
        [MaxLength(500)]
        public string AttributeDescription {  get; set; } = string.Empty;
    }
    public class UserAttributeRequest
    {

        [Required, MinLength(3), MaxLength(50)]
        public string UserAttributeName {  get; set; } = string.Empty;
        [MaxLength(500)]
        public string UserAttributeDescription { get; set; } = string.Empty;
        public int AttributeId { get; set; } = 0;
        public int UserId { get; set; }
    }
}
