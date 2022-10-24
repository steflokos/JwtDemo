
using System.Text.Json.Serialization;
namespace JwtDemo.Enumerations
{

    [JsonConverter(typeof(JsonStringEnumConverter))]

    public enum Role
    {
        Admin,
        User
    }
}

