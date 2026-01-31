using infotecs.Core.Models;

namespace infotecs.Application.Services
{
    public interface IUserService
    {
        Task<Guid> Create(UserInfotecs user);
        Task<Guid> Delete(Guid id);
        Task<List<UserInfotecs>> GetAll();

        Task<Result<List<UserInfotecs>>> GetByName(string name);
        Task<Guid> Update(Guid id, string name, DateTime startTime, DateTime endTime, string version);
    }
}