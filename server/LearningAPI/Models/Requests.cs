using System.ComponentModel.DataAnnotations;

namespace LearningAPI.Models
{
    public class RegisterRequest
    {
        [Required, MinLength(3), MaxLength(50)]
        // Regular expression to enforce name format
        [RegularExpression(@"^[a-zA-Z '-,.]+$",
            ErrorMessage = "Only allow letters, spaces and characters: ' - , .")]
        public string Name { get; set; } = string.Empty;

        [Required, EmailAddress, MaxLength(50)]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(8), MaxLength(50)]
        // Regular expression to enforce password complexity
        [RegularExpression(@"^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$",
            ErrorMessage = "At least 1 letter and 1 number")]
        public string Password { get; set; } = string.Empty;
    }
    public class LoginRequest
    {
        [Required, EmailAddress, MaxLength(50)]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(8), MaxLength(50)]
        public string Password { get; set; } = string.Empty;
    }
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
    public class PolicyRequest
    {
        public int ResourceTypeId { get; set; }
        public int ResourceId { get; set; }
        public List<Attributes>? RequiredAttributes { get; set; }
        [Required, MinLength(3), MaxLength(50)]
        public string PoliciesName { get; set; } = string.Empty;
        [MaxLength(500)]
        public string PoliciesDescription { get; set; } = string.Empty;
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

    public class SustainabilityGoalRequest
    {
        [Required, MinLength(3), MaxLength(100)]
        public string GoalName { get; set; } = string.Empty; // Name of the goal
        [MaxLength(500)]
        public string GoalDescription { get; set; } = string.Empty; // Description of the goal
        [Required]
        public int TargetValue { get; set; } // Target value
        [Required]
        public int CurrentValue { get; set; } // Current progress
        [Required]
        public DateTime Deadline { get; set; } // Deadline for the goal
    }
    public class SustainabilityBadgeRequest
    {
        [Required, MaxLength(255)]
        public string BadgeName { get; set; } = string.Empty;

        [MaxLength(255)]
        public string BadgeDescription { get; set; } = string.Empty;

        [Required]
        public DateTime AwardedOn { get; set; }
    }

    public class FoodWasteEntryRequest
    {
        [Required]
        public int IngredientId { get; set; }

        [Required]
        public int WasteAmount { get; set; }

        [Required]
        public DateTime LoggedOn { get; set; }

        [MaxLength(255)]
        public string WasteReason { get; set; } = string.Empty;
    }

}
