using System.Net;
using JwtDemo.Interfaces;

namespace JwtDemo.Middleware
{
    // You may need to install the Microsoft.AspNetCore.Http.Abstractions package into your project
    public class TokenManagerMiddleware:IMiddleware
    {
        private readonly IAccessTokenManager _tokenManager;

        public TokenManagerMiddleware(IAccessTokenManager tokenManager)
        {
            _tokenManager = tokenManager;
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            if (await _tokenManager.IsCurrentAccessTokenBlacklistedAsync())
            {
                await next(context);

                return;
            }
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
        }
    }

   
}

