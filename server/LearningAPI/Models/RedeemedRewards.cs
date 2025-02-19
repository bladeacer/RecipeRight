using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LearningAPI.Models;

public class RedeemedRewards
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string RewardName { get; set; }

    [Required]
    public string Description { get; set; }

    [Required]
    [Column(TypeName = "date")]
    public DateTime ExpiryDate { get; set; }

    [Required]
    public int Point { get; set; }

    [StringLength(20)]
    public string ImageFile { get; set; }

    [Required]
    public string Code { get; set; }

    [Required]
    public bool Redeemed { get; set; } = false;

    // Foreign key for User
    public int UserId { get; set; }

    // Navigation property for User
    [ForeignKey("UserId")]
    public User User { get; set; }
}