using System.ComponentModel.DataAnnotations;
using Org.BouncyCastle.Asn1.Cms;

namespace LearningAPI.Models
{
    

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
