using JwtDemo.DatabaseContext;
using JwtDemo.Enumerations;
using JwtDemo.Helpers;
using JwtDemo.Interfaces;
using JwtDemo.Models;
using Microsoft.AspNetCore.Identity;

namespace JwtDemo.Services
{
    public class AccountService : IAccountService
    {

        private readonly IJwtHandler _jwtHandler;
        private readonly IPasswordHasher<DbUser> _passwordHasher;
        private readonly IRefreshTokenManager _refreshTokenManager;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IAccessTokenManager _accessTokenManager;
        public AccountService(IJwtHandler jwtHandler,
            IPasswordHasher<DbUser> passwordHasher, IRefreshTokenManager refreshTokenManager, IServiceScopeFactory scopeFactory, IAccessTokenManager accessTokenManager)
        {
            _jwtHandler = jwtHandler;
            _passwordHasher = passwordHasher;
            _refreshTokenManager = refreshTokenManager;
            _scopeFactory = scopeFactory;
            _accessTokenManager = accessTokenManager;
        }

        public async Task SignUp(SignUpRequest signUpRequest)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                ApplicationDbContext db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                DbUser user = new DbUser()
                {
                    Username = signUpRequest.Username,
                    FirstName = signUpRequest.FirstName,
                    LastName = signUpRequest.LastName,
                    Email = signUpRequest.Email,
                    ContactNumber = signUpRequest.ContactNumber
                };

                AddRoles(user);

                string password = signUpRequest.Password;
                string hashed = SecretHasher.Hash(password);

                user.Password = hashed;

                await db.Users!.AddAsync(user);

                await db.SaveChangesAsync();
            }

        }
        public async Task SignOut(string refreshToken)
        {
            await this._refreshTokenManager.RevokeRefreshTokenAsync(refreshToken);
            await this._accessTokenManager.BlacklistCurrentAccessTokenAsync();
        }

        public async Task<JsonWebToken> SignIn(SignInRequest signInRequest)
        {

            using (var scope = _scopeFactory.CreateScope())
            {
                ApplicationDbContext db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                DbUser? user = await db.Users!.FindAsync(signInRequest.Username);

                if (user != null)
                {
                    string enteredPassword = signInRequest.Password!;

                    bool isPasswordCorrect = SecretHasher.Verify(enteredPassword, user.Password);
                    if (!isPasswordCorrect)
                    {
                        throw new Exception("Invalid credentials.");
                    }

                    RefreshTokenInfo RefreshTokenInfo = new RefreshTokenInfo { Username = user.Username, Roles = user.Role, ExpiresIn = null };

                    JsonWebToken jwt = _jwtHandler.GenerateJwt(RefreshTokenInfo);

                    var refreshToken = _passwordHasher.HashPassword(user, Guid.NewGuid().ToString())
                        .Replace("+", string.Empty)
                        .Replace("=", string.Empty)
                        .Replace("/", string.Empty);

                    jwt.RefreshToken = refreshToken;

                    await _refreshTokenManager.ActivateRefreshTokenAsync(new RefreshToken { Info = RefreshTokenInfo, Token = refreshToken });


                    return jwt;

                }
                throw new Exception("No user found.");

            }


        }


        private void AddRoles(DbUser DbUser)
        {
            DbUser.Role = new List<Role>
            {
                Role.User
            };
        }

    }
}

