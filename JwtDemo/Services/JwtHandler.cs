using System.IdentityModel.Tokens.Jwt;
using System.Text;
using JwtDemo.Interfaces;
using JwtDemo.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace JwtDemo.Services
{
    public class JwtHandler : IJwtHandler
    {
        private readonly JwtOptions _options;
        private readonly JwtSecurityTokenHandler _jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
        private readonly SecurityKey _securityKey;
        private readonly SigningCredentials _signingCredentials;
        private readonly JwtHeader _jwtHeader;

        public JwtHandler(IOptions<JwtOptions> options)
        {
            _options = options.Value;
            _securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SecretKey!));
            _signingCredentials = new SigningCredentials(_securityKey, SecurityAlgorithms.HmacSha256);
            _jwtHeader = new JwtHeader(_signingCredentials);
        }


        public JsonWebToken GenerateJwt(JwtUserInfo jwtUserInfo)
        {
            var nowUtc = DateTime.UtcNow;

            var expires = nowUtc.AddMinutes(_options.AccessTokenLifetime);

            var centuryBegin = new DateTime(1970, 1, 1);//.ToUniversalTime();

            var exp = (long)(new TimeSpan(expires.Ticks - centuryBegin.Ticks).TotalSeconds);

            var iat = (long)(new TimeSpan(nowUtc.Ticks - centuryBegin.Ticks).TotalSeconds);

            var t = jwtUserInfo.Roles;

            string[] roleArray = jwtUserInfo.Roles!.Select(i => i.ToString()).ToArray();


            var payload = new JwtPayload
            {
                {"sub", jwtUserInfo.Username},
                {"iss", _options.Issuer},
                {"iat", iat},
                {"exp", exp},
                {"unique_name", jwtUserInfo.Username},
                {"aud",_options.Audience},
                {"roles",roleArray}
            };
            var jwt = new JwtSecurityToken(_jwtHeader, payload);


            var token = _jwtSecurityTokenHandler.WriteToken(jwt);

            return new JsonWebToken
            {
                AccessToken = token,
                ExpiresIn = exp
            };
        }
    }
}

