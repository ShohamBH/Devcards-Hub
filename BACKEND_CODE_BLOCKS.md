# Backend Code Blocks - Ready to Copy & Paste

## 1. Card Entity Model

**File: `Models/Card.cs`**

```csharp
using System;
using System.Collections.Generic;

namespace DevCardsBackend.Models
{
    public class Card
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public string? AvatarUrl { get; set; }
        public List<string> Skills { get; set; } = new();
        public Dictionary<string, string> SocialLinks { get; set; } = new();
        public List<Project> Projects { get; set; } = new();
        public string ThemeName { get; set; } = "default";
        public string? UserId { get; set; }  // ✅ ADDED FOR USER OWNERSHIP
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Project
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Link { get; set; }
    }
}
```

---

## 2. Create Card DTO

**File: `DTOs/CreateCardDto.cs`**

```csharp
using System.Collections.Generic;

namespace DevCardsBackend.DTOs
{
    public class CreateCardDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public string? AvatarUrl { get; set; }
        public List<string> Skills { get; set; } = new();
        public Dictionary<string, string> SocialLinks { get; set; } = new();
        public List<ProjectDto> Projects { get; set; } = new();
        public string ThemeName { get; set; } = "default";
        public string? UserId { get; set; }  // ✅ ADDED FOR USER OWNERSHIP
    }

    public class ProjectDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Link { get; set; }
    }
}
```

---

## 3. Card Response DTO

**File: `DTOs/CardResponseDto.cs`**

```csharp
using System;
using System.Collections.Generic;

namespace DevCardsBackend.DTOs
{
    public class CardResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public string? AvatarUrl { get; set; }
        public List<string> Skills { get; set; } = new();
        public Dictionary<string, string> SocialLinks { get; set; } = new();
        public List<ProjectDto> Projects { get; set; } = new();
        public string ThemeName { get; set; } = "default";
        public string? UserId { get; set; }  // ✅ ADDED FOR USER OWNERSHIP
        public DateTime CreatedAt { get; set; }
    }
}
```

---

## 4. Cards Controller (COMPLETE WITH ALL ENDPOINTS)

**File: `Controllers/CardsController.cs`**

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DevCardsBackend.Data;
using DevCardsBackend.Models;
using DevCardsBackend.DTOs;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace DevCardsBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CardsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CardsController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/cards
        [HttpPost]
        public async Task<ActionResult<CardResponseDto>> CreateCard([FromBody] CreateCardDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var card = new Card
            {
                Id = Guid.NewGuid(),
                FullName = dto.FullName,
                Title = dto.Title,
                Bio = dto.Bio,
                AvatarUrl = dto.AvatarUrl,
                Skills = dto.Skills ?? new(),
                SocialLinks = dto.SocialLinks ?? new(),
                Projects = dto.Projects?.Select(p => new Project
                {
                    Title = p.Title,
                    Description = p.Description,
                    Link = p.Link
                }).ToList() ?? new(),
                ThemeName = dto.ThemeName ?? "default",
                UserId = dto.UserId,  // ✅ SAVE USER ID FROM REQUEST
                CreatedAt = DateTime.UtcNow
            };

            _context.Cards.Add(card);
            await _context.SaveChangesAsync();

            var response = MapToResponseDto(card);
            return CreatedAtAction(nameof(GetCard), new { id = card.Id }, response);
        }

        // GET: api/cards/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<CardResponseDto>> GetCard(Guid id)
        {
            var card = await _context.Cards.FindAsync(id);

            if (card == null)
            {
                return NotFound();
            }

            return MapToResponseDto(card);
        }

        // ✅ NEW ENDPOINT: GET: api/cards/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<CardResponseDto>> GetCardByUserId(string userId)
        {
            var card = await _context.Cards
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.CreatedAt)
                .FirstOrDefaultAsync();

            if (card == null)
            {
                return NotFound();
            }

            return MapToResponseDto(card);
        }

        // PATCH: api/cards/{id}/link
        [HttpPatch("{id}/link")]
        public async Task<IActionResult> LinkCardToUser(Guid id, [FromBody] LinkUserDto dto)
        {
            var card = await _context.Cards.FindAsync(id);

            if (card == null)
            {
                return NotFound();
            }

            card.UserId = dto.UserId;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/cards/count
        [HttpGet("count")]
        public async Task<ActionResult<object>> GetCardsCount()
        {
            var count = await _context.Cards.CountAsync();
            return Ok(new { count });
        }

        // Helper method to map Card entity to response DTO
        private CardResponseDto MapToResponseDto(Card card)
        {
            return new CardResponseDto
            {
                Id = card.Id.ToString(),
                FullName = card.FullName,
                Title = card.Title,
                Bio = card.Bio,
                AvatarUrl = card.AvatarUrl,
                Skills = card.Skills,
                SocialLinks = card.SocialLinks,
                Projects = card.Projects?.Select(p => new ProjectDto
                {
                    Title = p.Title,
                    Description = p.Description,
                    Link = p.Link
                }).ToList() ?? new(),
                ThemeName = card.ThemeName,
                UserId = card.UserId,  // ✅ INCLUDE USER ID IN RESPONSE
                CreatedAt = card.CreatedAt
            };
        }
    }

    // DTO for linking user to card
    public class LinkUserDto
    {
        public string UserId { get; set; } = string.Empty;
    }
}
```

---

## 5. Database Migration Command

After updating the models, run this in your .NET project terminal:

```bash
dotnet ef migrations add AddUserIdToCards
dotnet ef database update
```

---

## Summary of Changes:

### Backend:
1. ✅ Added `UserId` property to Card model
2. ✅ Added `UserId` to CreateCardDto
3. ✅ Added `UserId` to CardResponseDto
4. ✅ Updated CreateCard to save `UserId` from request
5. ✅ Added NEW endpoint: `GET /api/cards/user/{userId}`
6. ✅ Updated MapToResponseDto to include `UserId`

### Frontend (Already Applied):
1. ✅ Enhanced `api.ts` with detailed console logging
2. ✅ Updated `CardDashboard.tsx` initialization logic
3. ✅ Enhanced save logic with userId tracking
4. ✅ Added comprehensive debugging logs

### Next Steps:
1. Copy the backend code blocks above
2. Run the database migration
3. Test the flow by checking the browser console
4. Look for these logs:
   - 🔵 [INIT] Initializing session
   - 🔵 [AUTH] Current Supabase User ID
   - 🔵 [LOAD] Fetching user card
   - 🔵 [SAVE] Creating new card
   - ✅ [SAVE] Card saved successfully
