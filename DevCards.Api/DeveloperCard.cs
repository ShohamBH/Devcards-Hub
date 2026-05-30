using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using System.Text.Json.Serialization;

namespace DevCards.Api
{
    [Table("cards")]
    public class DeveloperCard : BaseModel
    {
        [PrimaryKey("id")]
        public Guid Id { get; set; }

        [Column("full_name")]
        public string FullName { get; set; } = string.Empty;

        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Column("bio")]
        public string? Bio { get; set; }

        [Column("avatar_url")]
        public string? AvatarUrl { get; set; }

        [Column("theme_name")]
        public string ThemeName { get; set; } = "default";

        [Column("skills")]
        [JsonPropertyName("skills")]
        public List<string>? Skills { get; set; }

        [Column("social_links")]
        [JsonPropertyName("social_links")]
        public Dictionary<string, string>? SocialLinks { get; set; }

        [Column("projects")]
        [JsonPropertyName("projects")]
        public List<ProjectInfo>? Projects { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}