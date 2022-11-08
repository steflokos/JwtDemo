using System.Text.Json;
using JwtDemo.DatabaseContext;
using JwtDemo.Interfaces;
using JwtDemo.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;

namespace JwtDemo.Services
{
    public class RefreshTokenManager : IRefreshTokenManager
    {
        private readonly IDistributedCache _cache;
        private readonly IOptions<JwtOptions> _jwtOptions;
        private readonly IJwtHandler _jwtHandler;
        private readonly IPasswordHasher<DbUser> _passwordHasher;

        private readonly IServiceScopeFactory _scopeFactory;


        public RefreshTokenManager(IDistributedCache cache, IOptions<JwtOptions> jwtOptions, IJwtHandler jwtHandler,
         IPasswordHasher<DbUser> passwordHasher, IServiceScopeFactory scopeFactory)
        {
            _cache = cache;
            _jwtOptions = jwtOptions;
            _jwtHandler = jwtHandler;
            _passwordHasher = passwordHasher;
            _scopeFactory = scopeFactory;
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
            using (var scope = _scopeFactory.CreateScope())
            {
                string jsonData = await _cache.GetStringAsync(token);

                if (string.IsNullOrEmpty(jsonData))
                {
                    throw new Exception("Something went wrong.");
                }

                JwtUserInfo? jwtUserInfo = JsonSerializer.Deserialize<JwtUserInfo>(jsonData);

                if (jwtUserInfo == null)
                {
                    throw new Exception("Something went wrong.");
                }

                ApplicationDbContext db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                DbUser? user = await db.Users!.FindAsync(jwtUserInfo.Username);

                var jwt = _jwtHandler.GenerateJwt(jwtUserInfo);
                //generate new rft for rft rotation implementation

                var refreshToken = _passwordHasher.HashPassword(user!, Guid.NewGuid().ToString())
                                        .Replace("+", string.Empty)
                                        .Replace("=", string.Empty)
                                        .Replace("/", string.Empty);

                jwt.RefreshToken = refreshToken;

                await this.RevokeRefreshTokenAsync(token);

                await this.ActivateRefreshTokenAsync(new RefreshToken { UserInfo = jwtUserInfo, Token = refreshToken });

                return jwt;

            }

        }
    }
}

