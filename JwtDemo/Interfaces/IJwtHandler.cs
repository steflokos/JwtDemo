using JwtDemo.Models;

namespace JwtDemo.Interfaces
{
    public interface IJwtHandler
    {
        JsonWebToken GenerateJwt(JwtUserInfo userInfo);

    }
}

