using JwtDemo.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace JwtDemo.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class AccessTokenController : ControllerBase
    {
        private readonly IAccessTokenManager _accessTokenManager;

        public AccessTokenController(IAccessTokenManager accessTokenManager)
        {
            _accessTokenManager = accessTokenManager;
        }

        //[AllowAnonymous]
        [HttpPost("cancel")]
        public async Task<IActionResult> CancelCurrentAccessToken()
        {
            await _accessTokenManager.BlacklistCurrentAccessTokenAsync();
            return NoContent();
        }
    }
}

