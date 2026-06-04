using DevCards.Api;
using Microsoft.EntityFrameworkCore;
using Supabase;

var builder = WebApplication.CreateBuilder(args);

// הגדרת CORS מאובטחת ומותאמת
var allowedOrigins = builder.Configuration["AllowedOrigins"];
if (string.IsNullOrWhiteSpace(allowedOrigins))
{
    allowedOrigins = "http://localhost:5173,https://localhost:5173";
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins(allowedOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries))
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// הוספת SQLite Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=devcards.db"));

// הוספת Global Exception Handler
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// הגדרת Supabase Client
var supabaseUrl = builder.Configuration["Supabase:Url"] ?? throw new Exception("Supabase URL is missing");
var supabaseKey = builder.Configuration["Supabase:Key"] ?? throw new Exception("Supabase Key is missing");

builder.Services.AddScoped<Supabase.Client>(_ =>
{
    var options = new SupabaseOptions
    {
        AutoConnectRealtime = false,
        AutoRefreshToken = false
    };
    var client = new Supabase.Client(supabaseUrl, supabaseKey, options);
    client.InitializeAsync().Wait();
    return client;
});

var app = builder.Build();

// ----- סדר השורות הקריטי עבור ה-Middleware -----

// 1. הפניית HTTPS חייבת להיות ראשונה כדי שה-CORS יעבוד גם אחרי ההפניה
app.UseHttpsRedirection();

// 2. ה-CORS חייב לבוא מיד אחרי ההפניה ולפני ה-Routing/Controllers
app.UseCors("AllowReact");

// Swagger רק ב-Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// הוספת Exception Handler
app.UseExceptionHandler();

app.UseAuthorization();
app.MapControllers();

app.Run();
