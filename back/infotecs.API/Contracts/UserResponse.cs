namespace infotecs.API.Contracts
{
    public record UserResponse(
        Guid Id,
        string Name,
        DateTime StartTime,
        DateTime EndTime,
        string Version);
}
