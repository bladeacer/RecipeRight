using LearningAPI.Models;
using Microsoft.AspNetCore.Mvc.DataAnnotations;

//using LearningAPI.Reference;
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
        public required DbSet<Resource> Resources { get; set; }
        public required DbSet<ResourceType> ResourceTypes { get; set; }
        public required DbSet<Attributes> Attributes { get; set; }
        public required DbSet<UserAttributes> UserAttributes { get; set; }

        //protected override void OnModelCreating(ModelBuilder builder)
        //{
        //    base.OnModelCreating(builder);
        //}


    }

}