using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore.Metadata.Internal;



namespace LearningAPI.Models
{
    public class SustainabilityGoal
    {
        public int SustainabilityGoalId { get; set; } // Primary Key

        public int UserId { get; set; } // Foreign Key
        public string GoalName { get; set; } = string.Empty;
        public string GoalDescription { get; set; } = string.Empty;
        public int TargetValue { get; set; }
        public int CurrentValue { get; set; }
        public DateTime Deadline { get; set; }
        public DateTime CreatedOn { get; set; }

        public User? User { get; set; }
    }
    public class SustainabilityBadge
    {
        [Key]
        public int BadgeId { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; } // FK to User

        [Required, MaxLength(255)]
        public string BadgeName { get; set; } = string.Empty;

        [MaxLength(255)]
        public string BadgeDescription { get; set; } = string.Empty;

        [Column(TypeName = "datetime")]
        public DateTime AwardedOn { get; set; }

        public User? User { get; set; } // Navigation property
    }

    public class FoodWasteEntry
    {
        [Key]
        public int WasteId { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; } // FK to User

        [ForeignKey("Ingredient")]
        public int IngredientId { get; set; } // FK to Ingredients

        [Required]
        public int WasteAmount { get; set; } // Amount wasted

        [Column(TypeName = "datetime")]
        public DateTime LoggedOn { get; set; }

        [MaxLength(255)]
        public string WasteReason { get; set; } = string.Empty;

        public User? User { get; set; } // Navigation property
    }
}
