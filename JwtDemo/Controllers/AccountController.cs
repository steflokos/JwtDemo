using JwtDemo.Interfaces;
using JwtDemo.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JwtDemo.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class AccountController : ControllerBase
    {

        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [AllowAnonymous]
        [HttpPost("sign-up")]
        public async Task<IActionResult> SignUp([FromBody] SignUpRequest signUpRequest)
        {
            await _accountService.SignUp(signUpRequest);
            return NoContent();
        }

        [HttpPost("sign-out")]
        public async Task<IActionResult> SignOut([FromBody] string? refreshToken = default)
        {
            if (string.IsNullOrEmpty(refreshToken))
            {
                return BadRequest();
            }

            await _accountService.SignOut(refreshToken);
            return NoContent();
        }
        [AllowAnonymous]
        [HttpPost("sign-in")]
        public async Task<IActionResult> SignIn([FromBody] SignInRequest signInRequest)
                    => Ok(await _accountService.SignIn(signInRequest));
    }
}

