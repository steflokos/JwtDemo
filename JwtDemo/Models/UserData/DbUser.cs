using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using JwtDemo.Enumerations;

namespace JwtDemo.Models
{

    public class DbUser
    {
        [Key]
        public string Username { get; set; }
        public string Password { get; set; }

        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        public string? ContactNumber { get; set; }
        public string? Email { get; set; }

        public List<Role>? Role { get; set; }
    }

}

