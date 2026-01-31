
using infotecs.Core.Models;
using infotecs.DataAccess.Repositories;

namespace infotecs.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<List<UserInfotecs>> GetAll()
        {
            return await _userRepository.Get();
        }

        public async Task<Result<List<UserInfotecs>>>  GetByName(string name)
        {
            var error = string.Empty;
            var users = await _userRepository.GetByName(name);

            if (!users.Any())
            {
                return Result<List<UserInfotecs>>
                    .NotFound("Пользователи не найдены");
            }
            return Result<List<UserInfotecs>>.Success(users);
        }

        public async Task<Guid> Create(UserInfotecs user)
        {
            return await _userRepository.Create(user);
        }

        public async Task<Guid> Update(Guid id, string name, DateTime startTime, DateTime endTime, string version)
        {
            return await _userRepository.Update(id, name, startTime, endTime, version);
        }

        public async Task<Guid> Delete(Guid id)
        {
            return await _userRepository.Delete(id);
        }
    }
}
