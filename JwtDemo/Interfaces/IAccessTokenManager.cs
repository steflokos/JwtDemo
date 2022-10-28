namespace JwtDemo.Interfaces
{
    public interface IAccessTokenManager
    {
        Task<bool> IsCurrentAccessTokenActiveAsync();
        Task BlacklistCurrentAccessTokenAsync();

        Task<bool> IsAccessTokenActiveAsync(string token);
        Task BlacklistAccessTokenAsync(string token);
    }
}

