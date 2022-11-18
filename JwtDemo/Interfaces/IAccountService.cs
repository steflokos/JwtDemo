

using JwtDemo.Models;

namespace JwtDemo.Interfaces
{
    public interface IAccountService
    {
        Task SignUp(SignUpRequest signUpRequest);
        
        //generate a new refresh and access token 
        Task<JsonWebToken> SignIn(SignInRequest signinReq);

        //revoke current active access and refresh token
        Task SignOut(string refreshToken);
    }
}

