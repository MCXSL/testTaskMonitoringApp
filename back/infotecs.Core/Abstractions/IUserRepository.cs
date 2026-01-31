using infotecs.Core.Models;

namespace infotecs.DataAccess.Repositories
{
    public interface IUserRepository
    {
        Task<Guid> Create(UserInfotecs user);
        Task<Guid> Delete(Guid id);
        Task<List<UserInfotecs>> Get();

        Task<List<UserInfotecs>> GetByName(string name);

        Task<Guid> Update(Guid id, string name, DateTime startTime, DateTime endTime, string version);
    }
}