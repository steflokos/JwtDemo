using JwtDemo.Models;

namespace JwtDemo.Interfaces
{
    public interface IRefreshTokenManager
    {

        Task<bool> IsRefreshTokenActiveAsync(string token);

        Task RevokeRefreshTokenAsync(string token);

        Task ActivateRefreshTokenAsync(RefreshToken refreshToken);

        Task<JsonWebToken> RefreshAccessTokenAsync(string token);

    }
}

