using Microsoft.EntityFrameworkCore;
using JwtDemo.Enumerations;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Text.Json;
using JwtDemo.Models;
using JwtDemo.DatabaseContext;

namespace JwtDemo.DatabaseContext
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options)
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            //an to thelo anti gia enum se string
            modelBuilder.Entity<DbUser>()

            .Property(u => u.Role)
            .HasConversion(v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),

            v => JsonSerializer.Deserialize<List<Role>>(v, (JsonSerializerOptions)null),

            new ValueComparer<List<Role>>(
            (c1, c2) => c1.SequenceEqual(c2),
            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
            c => c.ToList()));

            new DbInitializer(modelBuilder).Seed();
        }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //optionsBuilder.EnableSensitiveDataLogging();
        }

        public DbSet<DbUser>? Users { get; set; }
    }



}

