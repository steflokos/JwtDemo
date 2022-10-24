

using System.Text.Json;

namespace JwtDemo.Middleware
{
    // You may need to install the Microsoft.AspNetCore.Http.Abstractions package into your project
    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        public ErrorHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext)
        {

            try
            {
                await _next(httpContext);
            }
            catch (Exception exception)
            {
                await HandleErrorAsync(httpContext, exception);
            }
        }


        private static Task HandleErrorAsync(HttpContext context, Exception exception)
        {

                var response = new { message = exception.Message };

                string payload = JsonSerializer.Serialize(response);

                context.Response.ContentType = "application/json";

                context.Response.StatusCode = 400;

                return context.Response.WriteAsync(payload);


        }
    }




}

