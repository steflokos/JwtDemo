using System;
namespace JwtDemo.Models
{
    public class JsonWebToken
    {

        public string? AccessToken { get; set; }

        public string? RefreshToken { get; set; }

        public long ExpiresIn { get; set; }
    }
}

