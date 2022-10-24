
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using JwtDemo.Services;
using JwtDemo.Interfaces;
using JwtDemo.Middleware;
using JwtDemo.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using JwtDemo.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();
builder.Services.AddHttpContextAccessor();

builder.Services.AddSingleton<IAccountService, AccountService>();
builder.Services.AddSingleton<IJwtHandler, JwtHandler>();
//builder.Services.AddSingleton<IPasswordHasher<DbUser>, PasswordHasher<DbUser>>(); //isos na min to theloume mias kai exoume to secret hasher

builder.Services.AddTransient<IAccessTokenManager, AccessTokenManager>();
builder.Services.AddTransient<IRefreshTokenManager, RefreshTokenManager>();

builder.Services.AddTransient<TokenManagerMiddleware>();

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
   options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
   ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))));

//builder.Services.AddDistributedRedisCache(r => { r.Configuration = builder.Configuration["redis:connectionString"]; })
builder.Services.AddStackExchangeRedisCache(r => { r.Configuration = builder.Configuration["redis:connectionString"]; });


builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection("jwt"));


// Adding Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
// Adding Jwt Bearer
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = true;

    options.TokenValidationParameters = new TokenValidationParameters()
    {

        //RequireExpirationTime = true,
        ClockSkew = TimeSpan.Zero,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["jwt:SecretKey"])),
        ValidIssuer = builder.Configuration["jwt:issuer"],
        ValidAudience = builder.Configuration["jwt:audience"],
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
            {
                context.Response.Headers.Add("Token-Expired", "true");
            }
            return Task.CompletedTask;
        }

    };
});

builder.Services.AddCors(options =>
    options.AddPolicy(name: "AngularPolicy",
        cfg =>
        {
            cfg.AllowAnyHeader();
            cfg.AllowAnyMethod();
            //cfg.WithOrigins(builder.Configuration["AllowedCORS"]);
            cfg.WithOrigins("https://localhost/44451", "http://localhost/54993");//
            cfg.AllowCredentials();
            cfg.SetIsOriginAllowed(_ => true);
        }));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.UseMiddleware<ErrorHandlerMiddleware>();
app.UseAuthentication();
app.UseMiddleware<TokenManagerMiddleware>();
app.UseAuthorization();
app.UseCors("AngularPolicy");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();