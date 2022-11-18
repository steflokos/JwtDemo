

using JwtDemo.Models;

namespace JwtDemo.Interfaces
{
    public interface IRefreshTokenManager
    {
        //check if refresh token is active, meaning it is present
        //on redis cache as a string
        Task<bool> IsRefreshTokenActiveAsync(string token);

        //deactivate refresh token by removing it from redis cache
        Task RevokeRefreshTokenAsync(string token);

        //insert token in redis cache as a key along necessary values
        Task ActivateRefreshTokenAsync(RefreshToken refreshToken);

        //generate a new access token with the help of refresh token
        //as well as create a new refresh (rotation) and deactivate previous one
        Task<JsonWebToken> RefreshAccessTokenAsync(string token);

    }
}

