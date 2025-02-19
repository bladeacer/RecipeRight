using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Linq;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Dynamically load all entity configurations
        var entityTypes = Directory.GetFiles(AppDomain.CurrentDomain.BaseDirectory, "*.cs")
            .Where(file => file.EndsWith(".cs") && !file.Contains("AppDbContext"))
            .Select(file => Path.GetFileNameWithoutExtension(file))
            .ToList();

        foreach (var entityType in entityTypes)
        {
            var type = Type.GetType(entityType);
            if (type != null && modelBuilder.Model.FindEntityType(type) == null)
            {
                modelBuilder.Model.AddEntityType(type);
            }
        }

        base.OnModelCreating(modelBuilder);
    }
}