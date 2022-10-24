

using JwtDemo.Models;

namespace JwtDemo.Interfaces
{
    public interface IAccountService
    {
        Task SignUp(SignUpRequest signUpRequest);

        Task<JsonWebToken> SignIn(SignInRequest signinReq);

    }
}

