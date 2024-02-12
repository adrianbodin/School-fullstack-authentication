using System.Text.Json.Serialization;
using Inlämning2REST.Data;
using Inlämning2REST.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Inlämning2REST.Configuration;

public class Inlamning2RESTApp
{
    private readonly WebApplicationBuilder _builder;
    private readonly WebApplication _app;
    public Inlamning2RESTApp(string[] args)
    {
        _builder = WebApplication.CreateBuilder(args);

        ConfigureServices();

        _app = _builder.Build();
        
        ConfigureMiddlewares();
    }

    private void ConfigureServices()
    {
        _builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(_builder.Configuration.GetConnectionString("DefaultConnection")));
        
        AddAuthApi();
        
        //Keep this?
        _builder.Services.AddControllers();
            //.AddNewtonsoftJson(options =>
            //options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
        

        _builder.Services.AddEndpointsApiExplorer();
        
        _builder.Services.AddSwaggerGen(CustomSwaggerGenOptions);
    }

    private void AddAuthApi()
    {
        _builder.Services.AddAuthorization();

        _builder.Services.AddIdentityApiEndpoints<CustomUser>(CustomIdentityOptions)
            .AddEntityFrameworkStores<AppDbContext>();
    }

    private void CustomIdentityOptions(IdentityOptions options)
    {
        if (_builder.Environment.IsDevelopment())
        {
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireDigit = false;
            options.Password.RequireLowercase = false;
            options.Password.RequireUppercase = false;
            options.Password.RequiredLength = 4;
        }
    }

    private void CustomSwaggerGenOptions(SwaggerGenOptions options)
    {
        options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header,
            Name = "Authorization",
            Type = SecuritySchemeType.ApiKey
        });
        
        options.OperationFilter<SecurityRequirementsOperationFilter>();
    }
    
    private void ConfigureMiddlewares()
    {
        if (_app.Environment.IsDevelopment())
        {
            _app.UseSwagger();
            _app.UseSwaggerUI();
        }
        
        _app.UseCors(builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());

        _app.UseHttpsRedirection();

        _app.MapIdentityApi<CustomUser>();

        _app.UseAuthorization();

        _app.MapControllers();
    }

    public void Run()
    {
        _app.Run();
    }
}