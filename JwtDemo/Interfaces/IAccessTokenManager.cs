namespace JwtDemo.Interfaces
{
    public interface IAccessTokenManager
    {
        Task<bool> IsCurrentAccessTokenActiveAsync();
        Task DeactivateCurrentAccessTokenAsync();

        Task<bool> IsAccessTokenActiveAsync(string token);
        Task DeactivateAccessTokenAsync(string token);
    }
}

