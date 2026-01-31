using infotecs.API.Contracts;
using infotecs.Application.Services;
using infotecs.Core.Models;
using Microsoft.AspNetCore.Mvc;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace infotecs.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService) 
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<List<UserResponse>>> Get()
        {
            var users = await _userService.GetAll();

            var response = users.Select(b => new UserResponse(b.Id, b.Name, b.StartTime, b.EndTime, b.Version));
            
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> Create([FromBody] UserRequest request)
        {
            var (user, error) = UserInfotecs.Create(
                Guid.NewGuid(),
                request.Name,
                request.StartTime,
                request.EndTime,
                request.Version);
            if (!string.IsNullOrEmpty(error)) { 
                return BadRequest(error);
            }
            var userId = await _userService.Create(user);

            return Ok(userId);
        }
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<Guid>> Update(Guid id, [FromBody] UserRequest request)
        {
            var userId = await _userService.Update(id, 
                request.Name,
                request.StartTime,
                request.EndTime,
                request.Version);
            return Ok(userId);
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult<Guid>> Delete(Guid id)
        {
            return Ok(await _userService.Delete(id));
        }

        [HttpGet("by-name/{name}")]
        public async Task<ActionResult<List<UserResponse>>> GetByName(string name)
        {
            if (string.IsNullOrEmpty(name) || UserInfotecs.MAX_NAME_LENGTH < name.Length)
            {
                return BadRequest("Заданное для поиска имя пользователя пустое или привышает 255 символов;");
            }
            var users = await _userService.GetByName(name);
            var response = users.Data.Select(b => new UserResponse(b.Id, b.Name, b.StartTime, b.EndTime, b.Version));
            return Ok(response);
        }

        [HttpGet("ping")]
        public ActionResult<string> Ping()
        {
            return Ok("pong");
        }
    }
}
