
namespace JwtDemo.Models
{
    public class RefreshToken
    { 
        public string? Token { get; set; }
        public JwtUserInfo? UserInfo { get; set; }
    }
}

