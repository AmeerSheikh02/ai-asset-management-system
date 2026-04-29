using AssetManagementAPI.Services;
using AssetManagementAPI.Data;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using AssetManagementAPI.Models;
using System.Net.Http.Headers;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Add DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Application Services with Dependency Injection
builder.Services.AddScoped<IAssetService, AssetService>();
builder.Services.AddScoped<IAssetRepository, AssetRepository>();
builder.Services.AddScoped<IAssetQueryService, AssetQueryService>();
builder.Services.AddScoped<IAIService, AIService>();

// Configure LLM options and register LLM service using HttpClientFactory
builder.Services.Configure<LlmOptions>(builder.Configuration.GetSection("LLM"));
builder.Services.AddHttpClient<ILLMService, LLMService>((sp, client) =>
{
    var opts = sp.GetRequiredService<IOptions<LlmOptions>>().Value;
    if (!string.IsNullOrWhiteSpace(opts.BaseUrl))
    {
        client.BaseAddress = new Uri(opts.BaseUrl);
    }
    client.DefaultRequestHeaders.Accept.Clear();
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

    if (!string.IsNullOrWhiteSpace(opts.ApiKey))
    {
        var provider = (opts.Provider ?? "").ToLowerInvariant();
        if (provider.Contains("anthropic") || provider.Contains("claude"))
        {
            client.DefaultRequestHeaders.Add("x-api-key", opts.ApiKey);
        }
        else
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", opts.ApiKey);
        }
    }
});

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Asset Management API",
        Version = "v1",
        Description = "A clean architecture ASP.NET Core Web API for asset management"
    });

    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (System.IO.File.Exists(xmlPath))
    {
        options.IncludeXmlComments(xmlPath);
    }
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
            ?? new[] { "http://localhost:5173", "http://localhost:5174" };

        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Asset Management API v1");
        options.RoutePrefix = string.Empty; // Swagger at root
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.EnsureCreated();

    if (!dbContext.Assets.Any())
    {
        dbContext.Assets.AddRange(
            new Asset
            {
                Name = "Laptop 01",
                Description = "Standard office laptop",
                AssetType = "Computer",
                PurchasePrice = 1200,
                PurchaseDate = DateTime.UtcNow.AddMonths(-8),
                Status = "Active",
                Location = "Office A"
            },
            new Asset
            {
                Name = "Projector 01",
                Description = "Conference room projector",
                AssetType = "AV Equipment",
                PurchasePrice = 800,
                PurchaseDate = DateTime.UtcNow.AddMonths(-14),
                Status = "Damaged",
                Location = "Conference Room"
            },
            new Asset
            {
                Name = "Desk 12",
                Description = "Standing desk",
                AssetType = "Furniture",
                PurchasePrice = 450,
                PurchaseDate = DateTime.UtcNow.AddMonths(-20),
                Status = "Retired",
                Location = "Warehouse"
            }
        );

        dbContext.SaveChanges();
    }
}

app.Run();
