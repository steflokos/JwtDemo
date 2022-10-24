using JwtDemo.Enumerations;

namespace JwtDemo.Models
{
    public class JwtUserInfo
    {
        public string? Username { get; set; }
        public List<Role>? Roles { get; set; }

    }
}

