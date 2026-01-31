public class Result<T>
{
    public bool IsSuccess { get; }
    public T Data { get; }
    public string Error { get; }
    public int StatusCode { get; }

    private Result(T data, bool isSuccess, string error, int statusCode)
    {
        Data = data;
        IsSuccess = isSuccess;
        Error = error;
        StatusCode = statusCode;
    }

    public static Result<T> Success(T data) =>
        new(data, true, null, 200);

    public static Result<T> Fail(string error, int statusCode = 400) =>
        new(default, false, error, statusCode);

    public static Result<T> NotFound(string error = "Ресурс не найден") =>
        new(default, false, error, 404);
}