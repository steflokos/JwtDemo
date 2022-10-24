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
        public AccountService(IJwtHandler jwtHandler,
            IPasswordHasher<DbUser> passwordHasher, IRefreshTokenManager refreshTokenManager, IServiceScopeFactory scopeFactory)
        {
            _jwtHandler = jwtHandler;
            _passwordHasher = passwordHasher;
            _refreshTokenManager = refreshTokenManager;
            _scopeFactory = scopeFactory;
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

                    JwtUserInfo jwtUserInfo = new JwtUserInfo { Username = user.Username, Roles = user.Role };

                    var jwt = _jwtHandler.GenerateJwt(jwtUserInfo);

                    var refreshToken = _passwordHasher.HashPassword(user, Guid.NewGuid().ToString())
                        .Replace("+", string.Empty)
                        .Replace("=", string.Empty)
                        .Replace("/", string.Empty);

                    jwt.RefreshToken = refreshToken;

                    await _refreshTokenManager.ActivateRefreshTokenAsync(new RefreshToken { UserInfo = jwtUserInfo, Token = refreshToken });


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

