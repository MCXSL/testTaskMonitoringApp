namespace infotecs.API.Contracts
{
    public record UserRequest(
        string Name,
        DateTime StartTime,
        DateTime EndTime,
        string Version);
}
