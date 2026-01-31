using infotecs.Core.Models;
using infotecs.DataAccess.Entites;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace infotecs.DataAccess.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly InfotecsDbContext _context;
        public UserRepository(InfotecsDbContext context)
        {

            _context = context;
        }

        public async Task<List<UserInfotecs>> Get()
        {
            var userEntities = await _context.Users
                .AsNoTracking()
                .ToListAsync();
            var users = userEntities
                .Select(b => UserInfotecs.Create(b.Id, b.Name, b.StartTime, b.EndTime, b.Version).User)
                .ToList();
            return users;
        }
        public async Task<List<UserInfotecs>> GetByName(string name)
        {
            var userEntities = await _context.Users
                .AsNoTracking()
                .ToListAsync();
            var users = userEntities
                .Select(b => UserInfotecs.Create(b.Id, b.Name, b.StartTime, b.EndTime, b.Version).User)
                .Where(b => b.Name == name)
                .ToList();
            return users;
        }
        public async Task<Guid> Create(UserInfotecs user)
        {
            var userEntity = new UserEntity
            {
                Id = user.Id,
                Name = user.Name,
                StartTime = user.StartTime,
                EndTime = user.EndTime,
                Version = user.Version,
            };

            await _context.Users.AddAsync(userEntity);
            await _context.SaveChangesAsync();

            return userEntity.Id;
        }

        public async Task<Guid> Update(Guid id, string name, DateTime startTime, DateTime endTime, string version)
        {
            await _context.Users
                .Where(b => b.Id == id)
                .ExecuteUpdateAsync(s => s
                .SetProperty(b => b.Name, b => name)
                .SetProperty(b => b.StartTime, b => startTime)
                .SetProperty(b => b.EndTime, b => endTime)
                .SetProperty(b => b.Version, b => version)
                );
            return id;
        }

        public async Task<Guid> Delete(Guid id)
        {
            await _context.Users
                .Where(b => b.Id == id)
                .ExecuteDeleteAsync();
            return id;
        }
    }
}
