using System.Text.Json;
using System.Collections.Generic;

namespace DevCards.Api
{
    public class CreateCardRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public List<string> Skills { get; set; } = new();
        public Dictionary<string, string> SocialLinks { get; set; } = new();
        public List<ProjectInfo> Projects { get; set; } = new();
        public string ThemeName { get; set; } = "default";
    }

    public class ProjectInfo
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Link { get; set; } = string.Empty;
    }

    public class CardResponse
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public List<string> Skills { get; set; } = new();
        public Dictionary<string, string> SocialLinks { get; set; } = new();
        public List<ProjectInfo> Projects { get; set; } = new();
        public string ThemeName { get; set; } = "default";
        public DateTime CreatedAt { get; set; }
    }
}
