
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
        public TimeSpan? ExpiresIn { get; set; }

    }
}

