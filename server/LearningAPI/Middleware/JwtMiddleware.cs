using LearningAPI.Services;

namespace LearningAPI.Middleware
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ITokenBlacklistService _tokenBlacklistService;

        public JwtMiddleware(RequestDelegate next, ITokenBlacklistService tokenBlacklistService)
        {
            _next = next;
            _tokenBlacklistService = tokenBlacklistService;
        }

        public async Task Invoke(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token != null && _tokenBlacklistService.IsTokenBlacklisted(token))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Token is blacklisted.");
                return;
            }

            await _next(context);
        }
    }
}