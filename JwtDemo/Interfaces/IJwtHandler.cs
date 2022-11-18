

using JwtDemo.Models;

namespace JwtDemo.Interfaces
{
    public interface IJwtHandler
    {
        //generate a new access token with the help of refresh token
        JsonWebToken GenerateJwt(RefreshTokenInfo userInfo);
    }
}

