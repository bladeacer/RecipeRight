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


        public required DbSet<User> Users { get; set; }
        public required DbSet<BookmarkFolder> BookmarkFolders { get; set; }
        public required DbSet<BookmarkRecipe> BookmarkRecipes { get; set; }
        public DbSet<Fridge> Fridges { get; set; }

        public required DbSet<SustainabilityGoal> SustainabilityGoals { get; set; }

        public required DbSet<SustainabilityBadge> SustainabilityBadges { get; set; }
        public required DbSet<FoodWasteEntry> FoodWasteEntries { get; set; }
        public required DbSet<Resource> Resources { get; set; }
        public required DbSet<ResourceType> ResourceTypes { get; set; }
        public required DbSet<Attributes> Attributes { get; set; }
        public required DbSet<UserAttributes> UserAttributes { get; set; }

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