using System.Text.Json.Serialization;
namespace LearningAPI.Models
{
    
    public class SustainabilityGoalDTO
    {
        public int SustainabilityGoalId { get; set; }
        public string GoalName { get; set; } = string.Empty;
        public string GoalDescription { get; set; } = string.Empty;

        public DateTime Deadline { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
        public int UserId { get; set; }
        public UserDTO? User { get; set; }


    }
    public class SustainabilityBadgeDTO
    {
        public int BadgeId { get; set; }
        public string BadgeName { get; set; } = string.Empty;
        public string BadgeDescription { get; set; } = string.Empty;
        public DateTime AwardedOn { get; set; }
        public int UserId { get; set; }
        public UserDTO? User { get; set; }
    }

    public class FoodWasteEntryDTO
    {
        public int WasteId { get; set; }
        public int UserId { get; set; }
        public int IngredientId { get; set; }
        public int WasteAmount { get; set; }
        public DateTime LoggedOn { get; set; }
        public string WasteReason { get; set; } = string.Empty;
    }


}
