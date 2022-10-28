using JwtDemo.Interfaces;
using JwtDemo.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JwtDemo.Controllers
{
    [ApiController]
    [Route("[controller]")]
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class AccountController : ControllerBase
    {

        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpPost("sign-up")]
        [AllowAnonymous]
        public async Task<IActionResult> SignUp([FromBody] SignUpRequest signUpRequest)
        {
            await _accountService.SignUp(signUpRequest);
            return NoContent();
        }

        [HttpPost("sign-in")]
        [AllowAnonymous]
        public async Task<IActionResult> SignIn([FromBody] SignInRequest signInRequest)
            => Ok(await _accountService.SignIn(signInRequest));
    }
}

