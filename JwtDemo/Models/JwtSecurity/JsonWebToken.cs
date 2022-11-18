

namespace JwtDemo.Models
{
    public class JsonWebToken
    {
        public string? AccessToken { get; set; }

        public string? RefreshToken { get; set; }

        //access token expiration time in seconds from 1/1/1970
        public long ExpiresIn { get; set; }
    }
}



