using infotecs.DataAccess.Entites;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace infotecs.DataAccess
{
    public class InfotecsDbContext : DbContext
    {
        public InfotecsDbContext(DbContextOptions<InfotecsDbContext> options)
        :base(options) 
        {

        }
        
        public DbSet<UserEntity> Users { get; set; }
    }
}
