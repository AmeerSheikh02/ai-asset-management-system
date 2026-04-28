using AssetManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetManagementAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Asset> Assets { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Asset>()
                .HasKey(a => a.Id);

            modelBuilder.Entity<Asset>()
                .Property(a => a.Name)
                .IsRequired()
                .HasMaxLength(200);

            modelBuilder.Entity<Asset>()
                .Property(a => a.AssetType)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<Asset>()
                .Property(a => a.Status)
                .IsRequired()
                .HasMaxLength(50)
                .HasDefaultValue("Active");
        }
    }
}
