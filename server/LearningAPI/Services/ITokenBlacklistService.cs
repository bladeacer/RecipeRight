

namespace LearningAPI.Services
{
    public interface ITokenBlacklistService
    {
        void BlacklistToken(string token);
        bool IsTokenBlacklisted(string token);
    }
    public class TokenBlacklistService : ITokenBlacklistService
    {
        private readonly HashSet<string> blacklistedTokens = new();

        public void BlacklistToken(string token)
        {
            blacklistedTokens.Add(token);
        }

        public bool IsTokenBlacklisted(string token)
        {
            return blacklistedTokens.Contains(token);
        }
    }
}