
namespace JwtDemo.Models
{
    public class JwtOptions
    {
        //secret key used in access token issuing
        public string? SecretKey { get; set; }

        //access token lifetime in minutes
        public uint AccessTokenLifetime { get; set; }

        //refresh token token lifetime in minutes
        public uint RefreshTokenLifetime { get; set; }

        //used in bearer options for setting up scheme
        public bool ValidateLifetime { get; set; }

        //used in bearer options for setting up scheme
        public bool ValidateIssuer { get; set; }

        //used in bearer options for setting up scheme
        public bool ValidateAudience { get; set; }

        //for jwt iss claim
        public string? Issuer { get; set; }

        //for jwt aud claim
        public string? Audience { get; set; }
    }
}

