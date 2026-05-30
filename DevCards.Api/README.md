# 🔧 DevCards API

A robust ASP.NET Core Web API backend for the DevCards digital business card platform.

## 🛠 Tech Stack

- **.NET 8** - Latest LTS framework
- **C#** - Type-safe language
- **ASP.NET Core** - Web framework
- **Entity Framework Core** - ORM for database access
- **Supabase** - PostgreSQL database hosting
- **Global Exception Handling** - Centralized error management
- **Structured Logging** - Using built-in ILogger

## 📋 Prerequisites

- .NET 8 SDK
- PostgreSQL (via Supabase)
- Supabase account with configured database

## 🚀 Getting Started

### 1. Restore Dependencies

```bash
dotnet restore
```

### 2. Configure Environment Variables

Create a `.env` file or set environment variables:

```bash
# Supabase Configuration
Supabase__Url=https://your-project.supabase.co
Supabase__Key=your-supabase-key

# Database Connection
ConnectionStrings__DefaultConnection=Host=db.your-project.supabase.co;Database=postgres;Username=postgres;Password=your-password;Port=5432;SSL Mode=Require;Trust Server Certificate=true;

# CORS Configuration
AllowedOrigins=http://localhost:5173,http://localhost:3000

# Environment
ASPNETCORE_ENVIRONMENT=Development
```

For production, update with your actual domains:

```bash
ASPNETCORE_ENVIRONMENT=Production
AllowedOrigins=https://your-frontend-domain.com
```

### 3. Database Migrations

Apply migrations to set up the database schema:

```bash
dotnet ef database update
```

### 4. Run Development Server

```bash
dotnet run
```

API runs at `http://localhost:5000`

Access Swagger documentation at `http://localhost:5000/swagger` (Development only)

## 📦 Project Structure

```
DevCards.Api/
├── Controllers/              # API endpoints
│   └── CardsController.cs   # Card CRUD operations
├── Models/                  # Domain models
│   ├── DeveloperCard.cs    # Card entity
│   └── CreateCardRequest.cs # Request DTO
├── Services/                # Business logic
├── Migrations/              # EF Core migrations
├── GlobalExceptionHandler.cs # Centralized error handling
├── Program.cs               # App configuration
├── appsettings.json        # Configuration
├── appsettings.Development.json (in .gitignore)
└── DevCards.Api.csproj      # Project file
```

## 📚 API Endpoints

### Create Card

```http
POST /api/cards
Content-Type: application/json

{
  "fullName": "John Doe",
  "title": "Senior Developer",
  "bio": "Passionate about building great software",
  "avatarUrl": "https://...",
  "themeName": "vs-code",
  "skills": ["C#", "React", "TypeScript"],
  "socialLinks": {
    "github": "https://github.com/johndoe",
    "linkedin": "https://linkedin.com/in/johndoe"
  },
  "projects": [
    {
      "name": "DevCards",
      "description": "Digital business card platform",
      "url": "https://devcards.com"
    }
  ]
}
```

Response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "fullName": "John Doe",
  "title": "Senior Developer",
  "createdAt": "2024-05-31T12:00:00Z"
}
```

### Get Card

```http
GET /api/cards/{id}
```

### Update Card

```http
PUT /api/cards/{id}
Content-Type: application/json

{
  "fullName": "John Doe",
  "title": "Lead Developer",
  ...
}
```

### Delete Card

```http
DELETE /api/cards/{id}
```

## 🔐 Security Features

- ✅ **CORS Policy** - Restricted to specified origins
- ✅ **Environment Variables** - All sensitive data externalized
- ✅ **Global Exception Handler** - No stack traces exposed in production
- ✅ **Input Validation** - Server-side validation for all inputs
- ✅ **Swagger Security** - Disabled in production
- ✅ **SSL/TLS** - Secure database connection required
- ✅ **Logger Integration** - All errors logged for monitoring

## 🧪 Testing

```bash
dotnet build          # Build project
dotnet run           # Run with debugging
dotnet test          # Run unit tests (if configured)
```

## 📝 Configuration Files

### appsettings.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### appsettings.Development.json (NOT in Git)

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug"
    }
  },
  "Supabase": {
    "Url": "your-url",
    "Key": "your-key"
  },
  "ConnectionStrings": {
    "DefaultConnection": "your-connection-string"
  },
  "AllowedOrigins": "http://localhost:5173"
}
```

## 🌐 Deployment

### Prerequisites

1. Set up environment variables in your hosting provider
2. Ensure database migrations run during deployment

### Azure App Service

```bash
# Publish for Azure
dotnet publish -c Release -o ./publish

# Deploy using Azure CLI
az webapp up --name your-app-name --resource-group your-rg
```

### Heroku

```bash
heroku login
heroku create your-app-name
git push heroku main
```

### AWS Elastic Beanstalk

```bash
dotnet publish -c Release
eb init -p "ASP.NET Core on Windows" -r us-east-1
eb create my-environment
eb deploy
```

### Railway

1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Railway automatically deploys on git push

See [../DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions.

## 📊 Logging

The API uses structured logging:

```csharp
_logger.LogInformation("Card created: {CardId}", cardId);
_logger.LogError("Database error: {Exception}", ex);
```

View logs in your hosting provider's monitoring dashboard.

## 🔄 Database Schema

### DeveloperCard Table

```sql
CREATE TABLE developer_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  theme_name VARCHAR(50),
  skills JSON,
  social_links JSON,
  projects JSON,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🐛 Troubleshooting

### "Connection refused" Error

Verify Supabase connection string and ensure database is accessible.

### "CORS policy" Error

Check `AllowedOrigins` environment variable matches your frontend domain.

### Swagger Shows 404

Ensure `ASPNETCORE_ENVIRONMENT=Development` is set.

### Migrations Fail

```bash
# Reset database (development only)
dotnet ef database drop
dotnet ef database update
```

## 📞 Support

For issues or questions, contact: **shoham.dahan.pro@gmail.com**

---

**Made with ❤️ using DevCards**
