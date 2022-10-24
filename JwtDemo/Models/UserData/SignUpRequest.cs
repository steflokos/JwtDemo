using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

using JwtDemo.Enumerations;

namespace JwtDemo.Models
{

    public class SignUpRequest
    {
        public string Username { get; set; }

        public string Password { get; set; }

        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        public string? ContactNumber { get; set; }
        public string? Email { get; set; }
    }

}

