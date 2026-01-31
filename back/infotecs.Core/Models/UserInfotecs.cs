using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace infotecs.Core.Models
{
    public class UserInfotecs
    {
        public const int MAX_NAME_LENGTH = 255;
        // улучшить валидацию
        private UserInfotecs(Guid id, string name, DateTime startTime, DateTime endTime, string version)
        {
            Id = id;
            Name = name;
            StartTime = startTime;
            EndTime = endTime;
            Version = version;
        }
        public Guid Id { get; }

        public string Name { get; } = string.Empty;

        public DateTime StartTime { get; }

        public DateTime EndTime { get; }

        public string Version { get; } = string.Empty;

        public static (UserInfotecs User, string Error) Create(Guid id, string name, DateTime startTime, DateTime endTime, string version)
        {
            var error = string.Empty;

            if (string.IsNullOrEmpty(name) || name.Length > MAX_NAME_LENGTH)
            {
                error = "Имя пользователя пустое или привышает 255 символов";
            }
            var user = new UserInfotecs(id, name, startTime, endTime, version);

            return (user, error);
        }
    }
}
