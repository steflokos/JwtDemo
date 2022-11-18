
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

        //keep track of time that the refresh token
        //was issued in order to reduce time properly
        //on token rotation
        public DateTime IssuedAt { get; set; }

    }
}

