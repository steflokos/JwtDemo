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
        {
            TimeSpan expires;

            //if rft expires is null, function was called when user signed in
            //so we want to set expiration time according to jwt given options.
            //Else, we use previous rft expiration time, so when we rotate token
            //it will not be available to refresh access infinetely.
            if (refreshToken.Info!.IssuedAt != default)
            {
                var nowUtc = DateTime.UtcNow;
                var diff = (DateTime.UtcNow - refreshToken.Info!.IssuedAt).TotalSeconds;
                
                var lifetime = TimeSpan.FromMinutes(_jwtOptions.Value.RefreshTokenLifetime).TotalSeconds;
                
                if (lifetime - diff > 0)
                {
                    expires = TimeSpan.FromSeconds(lifetime - diff);
                }
                else
                {
                    expires = DateTime.Now.TimeOfDay;
                }

            }
            else
            {
                refreshToken.Info!.IssuedAt = DateTime.UtcNow;
                expires = TimeSpan.FromMinutes(_jwtOptions.Value.RefreshTokenLifetime);
            }

            var t = JsonSerializer.Serialize(refreshToken.Info);
            await _cache.SetStringAsync(refreshToken.Token, JsonSerializer.Serialize(refreshToken.Info),
                            new DistributedCacheEntryOptions
                            {
                                AbsoluteExpirationRelativeToNow = expires

                            });

        }




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

                RefreshTokenInfo? RefreshTokenInfo = JsonSerializer.Deserialize<RefreshTokenInfo>(jsonData);

                if (RefreshTokenInfo == null)
                {
                    throw new Exception("Something went wrong.");
                }

                ApplicationDbContext db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                DbUser? user = await db.Users!.FindAsync(RefreshTokenInfo.Username);

                var jwt = _jwtHandler.GenerateJwt(RefreshTokenInfo);
                //generate new rft for rft rotation implementation

                var refreshToken = _passwordHasher.HashPassword(user!, Guid.NewGuid().ToString())
                                        .Replace("+", string.Empty)
                                        .Replace("=", string.Empty)
                                        .Replace("/", string.Empty);

                jwt.RefreshToken = refreshToken;

                await this.RevokeRefreshTokenAsync(token);

                await this.ActivateRefreshTokenAsync(new RefreshToken { Info = RefreshTokenInfo, Token = refreshToken });

                return jwt;

            }

        }
    }
}

