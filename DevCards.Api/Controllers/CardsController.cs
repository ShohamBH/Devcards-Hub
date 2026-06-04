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
                FullName = request.FullName,
                Title = request.Title,
                Bio = request.Bio,
                AvatarUrl = request.AvatarUrl,
                ThemeName = request.ThemeName,
                UserId = request.UserId,
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

        [HttpGet("count")]
        public async Task<IActionResult> GetCardsCount()
        {
            try
            {
                var response = await _supabase
                    .From<DeveloperCard>()
                    .Select("id")
                    .Get();

                var count = response.Models?.Count() ?? 0;
                _logger.LogInformation("Retrieved total card count: {Count}", count);

                return Ok(new { count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching card count");
                return StatusCode(500, new { error = "Failed to fetch card count" });
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetCardByUserId(string userId)
        {
            try
            {
                _logger.LogInformation("Fetching card for user ID: {UserId}", userId);
                
                var response = await _supabase
                    .From<DeveloperCard>()
                    .Where(x => x.UserId == userId)
                    .Order("created_at", Supabase.Postgrest.Constants.Ordering.Descending)
                    .Limit(1)
                    .Get();

                var card = response.Models?.FirstOrDefault();
                
                if (card == null)
                {
                    _logger.LogInformation("No card found for user ID: {UserId}", userId);
                    return NotFound();
                }

                _logger.LogInformation("Card found for user ID: {UserId}, Card ID: {CardId}", userId, card.Id);
                return Ok(MapToResponse(card));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching card for user ID: {UserId}", userId);
                return StatusCode(500, "Failed to fetch user card");
            }
        }

        // PATCH: api/cards/{id}/link - Link card to user
        [HttpPatch("{id}/link")]
        public async Task<IActionResult> LinkCardToUser(Guid id, [FromBody] LinkUserRequest request)
        {
            try
            {
                var card = await _supabase
                    .From<DeveloperCard>()
                    .Where(x => x.Id == id)
                    .Single();

                if (card == null)
                {
                    return NotFound();
                }

                card.UserId = request.UserId;
                await _supabase.From<DeveloperCard>().Update(card);

                _logger.LogInformation("Card {CardId} linked to user {UserId}", id, request.UserId);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error linking card {CardId} to user", id);
                return StatusCode(500, "Failed to link card to user");
            }
        }

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
                Bio = card.Bio ?? string.Empty,
                AvatarUrl = card.AvatarUrl ?? string.Empty,
                ThemeName = card.ThemeName,
                UserId = card.UserId,
                CreatedAt = card.CreatedAt,
                Skills = card.Skills ?? new(),
                SocialLinks = card.SocialLinks ?? new(),
                Projects = card.Projects ?? new()
            };
        }
    }

    public class LinkUserRequest
    {
        public string UserId { get; set; } = string.Empty;
    }
}