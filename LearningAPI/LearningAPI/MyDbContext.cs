using LearningAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace LearningAPI
{
    public class MyDbContext(IConfiguration configuration) : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string? connectionString = configuration.GetConnectionString("MyConnection");
            if (connectionString != null)
            {
                optionsBuilder.UseMySQL(connectionString);
            }
        }

        public required DbSet<Tutorial> Tutorials { get; set; }

        public required DbSet<User> Users { get; set; }
        public required DbSet<BookmarkFolder> BookmarkFolders { get; set; }
        public required DbSet<BookmarkRecipe> BookmarkRecipes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure BookmarkFolder and BookmarkRecipe relationships
            modelBuilder.Entity<BookmarkFolder>()
                .HasMany(f => f.Recipes)
                .WithOne()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BookmarkRecipe>()
                .HasKey(r => r.Id);

            modelBuilder.Entity<BookmarkFolder>()
                .HasKey(f => f.Id);
        }
    }
}