
using JwtDemo.Interfaces;
using JwtDemo.Models;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;

namespace JwtDemo.Services
{
    public class AccessTokenManager : IAccessTokenManager
    {
        private readonly IDistributedCache _cache;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IOptions<JwtOptions> _jwtOptions;

        public AccessTokenManager(IDistributedCache cache,
                IHttpContextAccessor httpContextAccessor,
                IOptions<JwtOptions> jwtOptions
            )
        {
            
            _cache = cache;
            _httpContextAccessor = httpContextAccessor;
            _jwtOptions = jwtOptions;
        }

        public async Task<bool> IsCurrentAccessTokenBlacklistedAsync()
            => await IsAccessTokenActiveAsync(GetCurrentAccessTokenAsync());

        public async Task BlacklistCurrentAccessTokenAsync()
            => await BlacklistAccessTokenAsync(GetCurrentAccessTokenAsync());

        public async Task<bool> IsAccessTokenActiveAsync(string token)
            => await _cache.GetStringAsync(token) == null;


        public async Task BlacklistAccessTokenAsync(string token)
            => await _cache.SetStringAsync(token,
                " ", new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow =
                        TimeSpan.FromMinutes(_jwtOptions.Value.AccessTokenLifetime)
                });

        private string GetCurrentAccessTokenAsync()
        {
            
            var authorizationHeader = _httpContextAccessor
                .HttpContext!.Request.Headers["authorization"];

            return authorizationHeader == StringValues.Empty
                ? string.Empty
                : authorizationHeader.Single().Split(" ").Last();
        }

       

        
    }
}

