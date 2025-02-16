using System.ComponentModel.DataAnnotations;

public class ChangeSecurityRequest
{
    [Required(ErrorMessage = "Current password is required.")]
    [MinLength(8), MaxLength(50)]
    public string CurrentPassword { get; set; }

    [Required(ErrorMessage = "Please fill this in")]
    [MinLength(8), MaxLength(50)]
    public string? NewPassword { get; set; }

    [Required(ErrorMessage = "Please fill this in")]
    [MinLength(8), MaxLength(50)]
    [Compare("NewPassword", ErrorMessage = "New passwords do not match.")]
    public string? ConfirmNewPassword { get; set; }
}
