namespace LearningAPI.Models
{
    public class AuthResponse
    {
        public UserDTO User { get; set; } = new UserDTO();
    }
    public class UploadResponse
    {
        public string Filename { get; set; } = string.Empty;
    }
    public class LoginResponse
    {
        public UserDTO User { get; set; } = new UserDTO();

        public string AccessToken { get; set; } = string.Empty;
    }

}
