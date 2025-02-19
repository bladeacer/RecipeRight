using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LearningAPI.Models;

namespace YourNamespace.Models
{
    [Table("rewards")]
    public class Reward
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string RewardName { get; set; }

        [Required]
        public string Description { get; set; }

        public DateTime? ExpiryDate { get; set; }

        [Required]
        public int Point { get; set; }

        [StringLength(20)]
        public string ImageFile { get; set; }

        // Foreign Key
        [ForeignKey("User")]
        public int UserId { get; set; }
        
        // Navigation Property
        public virtual User User { get; set; }
    }
}
