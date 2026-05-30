using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using System.Text.Json;
using Supabase;

namespace DevCards.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CardsController : ControllerBase
    {
        private readonly Supabase.Client _supabase;
        private readonly ILogger<CardsController> _logger;

        public CardsController(Supabase.Client supabase, ILogger<CardsController> logger)
        {
            _supabase = supabase;
            _logger = logger;
        }

        // 1. POST: api/cards - שמירת כרטיס חדש ויצירת UUID
        [HttpPost]
        public async Task<IActionResult> CreateCard([FromBody] CreateCardRequest request)
        {
            if (string.IsNullOrEmpty(request.FullName) || string.IsNullOrEmpty(request.Title))
            {
                return BadRequest("שם מלא ותפקיד הם שדות חובה.");
            }

            TimeZoneInfo israelTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Israel Standard Time");
            DateTime now = TimeZoneInfo.ConvertTime(DateTime.Now, israelTimeZone);

            var card = new DeveloperCard
            {
                // לא מגדירים ID - תנו ל-Supabase ליצור אותו
                FullName = request.FullName,
                Title = request.Title,
                Bio = request.Bio,
                AvatarUrl = request.AvatarUrl,
                ThemeName = request.ThemeName,
                Skills = request.Skills,
                SocialLinks = request.SocialLinks,
                Projects = request.Projects,
                CreatedAt = now
            };

            var response = await _supabase.From<DeveloperCard>().Insert(card);
            
            var savedCard = response.Models.FirstOrDefault();
            if (savedCard == null)
            {
                _logger.LogError("Failed to create card for user: {FullName}", request.FullName);
                return StatusCode(500, "Failed to create card");
            }
            
            _logger.LogInformation("Card created successfully with ID: {CardId}", savedCard.Id);

            return Ok(MapToResponse(savedCard));
        }

        // 2. GET: api/cards/{id} - שליפת כרטיס לפי UUID בשביל עמוד הנחיתה הציבורי
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCard(Guid id)
        {
            try
            {
                var response = await _supabase
                    .From<DeveloperCard>()
                    .Where(x => x.Id == id)
                    .Single();

                if (response == null)
                {
                    return NotFound("הכרטיס המבוקש לא נמצא.");
                }

                return Ok(MapToResponse(response));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching card with ID: {CardId}", id);
                return NotFound("הכרטיס המבוקש לא נמצא.");
            }
        }

        private CardResponse MapToResponse(DeveloperCard card)
        {
            return new CardResponse
            {
                Id = card.Id.ToString(),
                FullName = card.FullName,
                Title = card.Title,
                Bio = card.Bio,
                AvatarUrl = card.AvatarUrl,
                ThemeName = card.ThemeName,
                CreatedAt = card.CreatedAt,
                Skills = card.Skills ?? new(),
                SocialLinks = card.SocialLinks ?? new(),
                Projects = card.Projects ?? new()
            };
        }
    }
}