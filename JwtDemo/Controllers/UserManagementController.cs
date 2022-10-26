using JwtDemo.DatabaseContext;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace JwtDemo.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]

    public class UserManagementController : ControllerBase
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserManagementController(IServiceScopeFactory scopeFactory, IHttpContextAccessor httpContextAccessor)
        {
            _scopeFactory = scopeFactory;
            _httpContextAccessor = httpContextAccessor;
        }

        

        [HttpGet("who-am-i")]
        [AllowAnonymous]
        //[Authorize(Roles = $"{nameof(Role.Seller)},{nameof(Role.Bidder)},{nameof(Role.Admin)}")]
        public ActionResult<string> GetWhoAmI()
        {
            string whoAmI =_httpContextAccessor.HttpContext!.User.Identity!.Name!;
            return Content(whoAmI);
        }

       
        [AllowAnonymous]
        [HttpGet("already-used/{username}")]
        public async Task<bool> Get(string username)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                ApplicationDbContext db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                if (db.Users != null)
                {
                    return await db.Users.AnyAsync(user => user.Username == username);
                }

            }

            return true; //if problem occurs better to return true than to have db exception

        }

        

    }
}

