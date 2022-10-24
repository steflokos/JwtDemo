using System.Text.Json;
using JwtDemo.Interfaces;
using JwtDemo.Models;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;

namespace JwtDemo.Services
{
    public class RefreshTokenManager : IRefreshTokenManager
    {
        private readonly IDistributedCache _cache;
        private readonly IOptions<JwtOptions> _jwtOptions;
        private readonly IJwtHandler _jwtHandler;


        public RefreshTokenManager(IDistributedCache cache, IOptions<JwtOptions> jwtOptions,IJwtHandler jwtHandler)
        {
            _cache = cache;
            _jwtOptions = jwtOptions;
            _jwtHandler = jwtHandler;
        }

        public async Task ActivateRefreshTokenAsync(RefreshToken refreshToken)

        => await _cache.SetStringAsync(refreshToken.Token, JsonSerializer.Serialize(refreshToken.UserInfo),
                        new DistributedCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow =
                                TimeSpan.FromMinutes(_jwtOptions.Value.RefreshTokenLifetime)
                        });


        public async Task<bool> IsRefreshTokenActiveAsync(string token)
            => (await _cache.GetStringAsync(token)) != null;



        public async Task RevokeRefreshTokenAsync(string token)
            => await _cache.RemoveAsync(token);


        public async Task<JsonWebToken> RefreshAccessTokenAsync(string token)
        {

            string jsonData =await _cache.GetStringAsync(token);

            JwtUserInfo? user = JsonSerializer.Deserialize<JwtUserInfo>(jsonData);

            if (user == null)
            {
                throw new Exception("Something went wrong.");
            }

            var jwt = _jwtHandler.GenerateJwt(user);

            jwt.RefreshToken = token;

            return jwt;
        }
    }
}

