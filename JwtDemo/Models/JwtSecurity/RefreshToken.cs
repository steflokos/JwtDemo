
using JwtDemo.Enumerations;

namespace JwtDemo.Models
{
    public class RefreshToken
    { 
        public string? Token { get; set; }
        public RefreshTokenInfo? Info { get; set; }
    }

    public class RefreshTokenInfo
    {
        public string? Username { get; set; }
        public List<Role>? Roles { get; set; }

        //refresh token expiration time in TimeSpan stored
        //in redis and used in refresh token rotation
        //as expiration time (so it is not updated every time)
        public TimeSpan? ExpiresIn { get; set; }

    }
}

