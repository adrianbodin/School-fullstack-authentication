using Inlämning2REST.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Inlämning2REST.Data;

public class AppDbContext : IdentityDbContext<CustomUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
    public DbSet<Movie> Movies { get; set; }
    
    public DbSet<Review> Reviews { get; set; }
    
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        var userId1 = Guid.NewGuid().ToString();
        var userId2 = Guid.NewGuid().ToString();

        var appUser1 = new CustomUser
        {
            Id = userId1,
            UserName = "user1@example.com",
            NormalizedUserName = "USER1@EXAMPLE.COM",
            Email = "user1@example.com",
            NormalizedEmail = "USER1@EXAMPLE.COM",
            EmailConfirmed = false,
            SecurityStamp = Guid.NewGuid().ToString(),
            ConcurrencyStamp = Guid.NewGuid().ToString(),
            PhoneNumber = null,
            PhoneNumberConfirmed = false,
            TwoFactorEnabled = false,
            LockoutEnd = null,
            LockoutEnabled = true,
            AccessFailedCount = 0
        };

        var appUser2 = new CustomUser
        {
            Id = userId2,
            UserName = "user2@example.com",
            NormalizedUserName = "USER2@EXAMPLE.COM",
            Email = "user2@example.com",
            NormalizedEmail = "USER2@EXAMPLE.COM",
            EmailConfirmed = false,
            SecurityStamp = Guid.NewGuid().ToString(),
            ConcurrencyStamp = Guid.NewGuid().ToString(),
            PhoneNumber = null,
            PhoneNumberConfirmed = false,
            TwoFactorEnabled = false,
            LockoutEnd = null,
            LockoutEnabled = true,
            AccessFailedCount = 0
        };
        
        var hasher = new PasswordHasher<CustomUser>();
        appUser1.PasswordHash = hasher.HashPassword(appUser1, "Admin123!");
        appUser2.PasswordHash = hasher.HashPassword(appUser2, "Admin123!");
        
        modelBuilder.Entity<CustomUser>().HasData(appUser1);
        modelBuilder.Entity<CustomUser>().HasData(appUser2);
        
        modelBuilder.Entity<Movie>().HasData(
            new Movie
            {
                Id = 1,
                Title = "The Shawshank Redemption",
                ReleaseYear = 1994
            },
            new Movie
            {
                Id = 2,
                Title = "The Godfather",
                ReleaseYear = 1972
            },
            new Movie
            {
                Id = 3,
                Title = "The Dark Knight",
                ReleaseYear = 2008
            },
            new Movie
            {
                Id = 4,
                Title = "The Godfather: Part II",
                ReleaseYear = 1974
            },
            new Movie
            {
                Id = 5,
                Title = "The Lord of the Rings: The Return of the King",
                ReleaseYear = 2003
            }
            );
        
        modelBuilder.Entity<Review>().HasData(
            
            new Review
            {
                Id = 1,
                Grade = 5,
                Comment = "This is a great movie!",
                MovieId = 1,
                Username = "user1@example.com"
            },
            new Review
            {
                Id = 2,
                Grade = 4,
                Comment =  "This is a good movie.",
                MovieId = 1,
                Username = "user2@example.com"
            },
            new Review
            {
                Id = 3,
                Grade = 3,
                Comment = "This is an ok movie.",
                MovieId = 1,
                Username = "user1@example.com"
            },
            new Review
            {
                Id = 4,
                Grade = 2,
                Comment = "This is a bad movie.",
                MovieId = 2,
                Username = "user2@example.com"
            },
            new Review
            {
                Id = 5,
                Grade = 1,
                Comment = "This is a terrible movie!",
                MovieId = 2,
                Username = "user1@example.com"
            },
            new Review
            {
                Id = 6,
                Grade = 4,
                Comment = "I like this movie.",
                MovieId = 3,
                Username = "user1@example.com"
,           },
            new Review
            {
                Id = 7,
                Grade = 4,
                Comment = "This is a great movie!",
                MovieId = 4,
                Username = "user2@example.com"
            },
            new Review
            {
                Id = 8,
                Grade = 5,
                Comment = "This is a super good movie!",
                MovieId = 5,
                Username = "user1@example.com"
            }
        );
    }
    
}