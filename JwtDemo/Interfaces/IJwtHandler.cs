using JwtDemo.Models;

namespace JwtDemo.Interfaces
{
    public interface IJwtHandler
    {
        JsonWebToken GenerateJwt(RefreshTokenInfo userInfo);

    }
}

