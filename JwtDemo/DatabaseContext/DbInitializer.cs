using JwtDemo.Enumerations;
using JwtDemo.Helpers;
using JwtDemo.Models;
using Microsoft.EntityFrameworkCore;


namespace JwtDemo.DatabaseContext
{
    public class DbInitializer
    {
        private readonly ModelBuilder modelBuilder;

        public DbInitializer(ModelBuilder modelBuilder)
        {
            this.modelBuilder = modelBuilder;
        }

        public void Seed()
        {
            modelBuilder.Entity<DbUser>(u =>
             {
                 u.HasData(new DbUser
                 {

                     Username = "admin",
                     Password = SecretHasher.Hash("admin"),
                     Email = "admin@mail.com",
                     ContactNumber = "1231231231",
                     FirstName = "admin",
                     LastName = "admin",
                     Role = new List<Role>() { Role.Admin },
                 });
                 
             });

        }
    }
}