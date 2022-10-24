using System;
namespace JwtDemo.Models
{
    public class JwtOptions
    {
        public string? SecretKey { get; set; }

        public int AccessTokenLifetime { get; set; }

        public int RefreshTokenLifetime { get; set; }

        public bool ValidateLifetime { get; set; }

        public bool ValidateIssuer { get; set; }

        public bool ValidateAudience { get; set; }

        public string? Issuer { get; set; }

        public string? Audience { get; set; }
    }
}

