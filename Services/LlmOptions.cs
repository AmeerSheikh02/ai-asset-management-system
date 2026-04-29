namespace AssetManagementAPI.Services
{
    public class LlmOptions
    {
        /// <summary>
        /// Provider name: e.g. "OpenAI" or "Anthropic" (or "Claude").
        /// </summary>
        public string? Provider { get; set; }

        /// <summary>
        /// API key for the provider. Keep this secret (do not commit real keys).
        /// </summary>
        public string? ApiKey { get; set; }

        /// <summary>
        /// Optional base URL override for the provider API.
        /// </summary>
        public string? BaseUrl { get; set; }

        /// <summary>
        /// Default model to call (e.g. "gpt-4o-mini", "gpt-4o", "claude-2.1").
        /// </summary>
        public string? Model { get; set; }
    }
}
