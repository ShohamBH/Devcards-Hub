using Microsoft.EntityFrameworkCore;

namespace DevCards.Api
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<DeveloperCard> Cards { get; set; }
    }
}