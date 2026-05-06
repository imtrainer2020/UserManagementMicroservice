using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.CL
{
    public class ApiResponse<T>
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }

        public ApiResponse() { }
        public ApiResponse(bool isSuccess = true, string message = "Success", T? data = default(T))
        {
            IsSuccess = isSuccess;
            Message = message;
            Data = data;
        }
        public static ApiResponse<T> Success(T data, string msg = "Success")
            => new() { IsSuccess = true, Message = msg, Data = data };
        public static ApiResponse<T> Fail(string msg)
            => new() { IsSuccess = false, Message = msg };
    }
}
