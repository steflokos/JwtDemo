using JwtDemo.Interfaces;
using JwtDemo.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace JwtDemo.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class RefreshTokenController : ControllerBase
    {
        private readonly IRefreshTokenManager _refreshTokenManager;

        public RefreshTokenController(IRefreshTokenManager refreshTokenManager)
        {
            _refreshTokenManager = refreshTokenManager;
        }

        [HttpPost("revoke/{token}")]
        [AllowAnonymous]
        public async Task<IActionResult> RevokeRefreshToken(string token)
        {
            await _refreshTokenManager.RevokeRefreshTokenAsync(token);
            return NoContent();
        }


        [HttpPost("refresh/{token}")]
        [AllowAnonymous]
        public async Task<IActionResult> RefreshAccessToken(string token)
        {

            JsonWebToken jwt = await _refreshTokenManager.RefreshAccessTokenAsync(token);

            if (jwt != null)
            {
                return Ok(jwt);
            }
            else return Unauthorized();
        }

        [HttpGet("is-active/{token}")]
        public async Task<IActionResult> CheckRefreshTokenExpiration(string token)
         => Ok(await _refreshTokenManager.IsRefreshTokenActiveAsync(token));
    }
}

