

namespace JwtDemo.Interfaces
{
    public interface IAccessTokenManager
    {
        //check if specified token is active 
        //meaning that is not present on redis cache
        Task<bool> IsAccessTokenActiveAsync(string token);

        //put specified token in blacklist by inserting it 
        //in redis cache
        Task BlacklistAccessTokenAsync(string token);

        //check if token present in http context is active 
        //by using previous function
        Task<bool> IsCurrentAccessTokenBlacklistedAsync();

        //blacklist token present in http context
        //by using previous function
        Task BlacklistCurrentAccessTokenAsync();
    }
}


