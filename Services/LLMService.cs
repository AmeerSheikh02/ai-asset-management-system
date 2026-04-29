using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;

namespace AssetManagementAPI.Services
{
    public class LLMService : ILLMService
    {
        private readonly HttpClient _httpClient;
        private readonly LlmOptions _options;
        private readonly ILogger<LLMService> _logger;

        public LLMService(HttpClient httpClient, IOptions<LlmOptions> options, ILogger<LLMService> logger)
        {
            _httpClient = httpClient;
            _options = options.Value ?? new LlmOptions();
            _logger = logger;
        }

        public async Task<JsonDocument> QueryAsync(string query, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(query))
                throw new ArgumentException("Query must not be empty.", nameof(query));

            // Build a system/user instruction to request valid JSON
            var prompt = $"Respond ONLY with valid JSON.\n\nSchema: {{ \"result\": string, \"metadata\": object }}\n\nUser query: {query}";

            try
            {
                var provider = (_options.Provider ?? "openai").Trim().ToLowerInvariant();

                if (provider.Contains("anthropic") || provider.Contains("claude"))
                {
                    return await QueryAnthropicAsync(prompt, cancellationToken).ConfigureAwait(false);
                }

                // default to OpenAI-compatible chat completions
                return await QueryOpenAiChatAsync(prompt, cancellationToken).ConfigureAwait(false);
            }
            catch (JsonException je)
            {
                _logger.LogError(je, "Failed parsing JSON from LLM response");
                // return a safe JSON wrapper containing the error
                var err = JsonDocument.Parse($"{{\"error\": {JsonSerializer.Serialize(je.Message)} }}");
                return err;
            }
        }

        private async Task<JsonDocument> QueryOpenAiChatAsync(string prompt, CancellationToken cancellationToken)
        {
            var model = _options.Model ?? "gpt-4o-mini";

            var body = new
            {
                model,
                messages = new[] {
                    new { role = "system", content = "You are a helpful assistant that responds only with valid JSON." },
                    new { role = "user", content = prompt }
                },
                temperature = 0.2,
                max_tokens = 1024
            };

            var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
            using var resp = await _httpClient.PostAsync("/v1/chat/completions", content, cancellationToken).ConfigureAwait(false);
            var respText = await resp.Content.ReadAsStringAsync(cancellationToken).ConfigureAwait(false);
            resp.EnsureSuccessStatusCode();

            // Try to extract chat message text conservatively
            try
            {
                using var doc = JsonDocument.Parse(respText);
                if (doc.RootElement.TryGetProperty("choices", out var choices) && choices.GetArrayLength() > 0)
                {
                    var first = choices[0];
                    if (first.TryGetProperty("message", out var message) && message.TryGetProperty("content", out var contentEl))
                    {
                        var text = contentEl.GetString() ?? string.Empty;
                        return ParseOrWrapText(text);
                    }
                }

                // Fallback: entire response might be JSON
                return JsonDocument.Parse(respText);
            }
            catch (JsonException)
            {
                // Response isn't JSON or different shape: wrap raw text
                return ParseOrWrapText(respText);
            }
        }

        private async Task<JsonDocument> QueryAnthropicAsync(string prompt, CancellationToken cancellationToken)
        {
            // Anthropic/Claude expects a different shape (example: /v1/complete)
            var model = _options.Model ?? "claude-2.1";

            var body = new
            {
                model,
                prompt = $"Human: {prompt}\n\nAssistant:",
                max_tokens_to_sample = 1024,
                temperature = 0.2
            };

            var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
            using var resp = await _httpClient.PostAsync("/v1/complete", content, cancellationToken).ConfigureAwait(false);
            var respText = await resp.Content.ReadAsStringAsync(cancellationToken).ConfigureAwait(false);
            resp.EnsureSuccessStatusCode();

            try
            {
                using var doc = JsonDocument.Parse(respText);
                // Anthropic shape: { completion: "..." } or { completion: "...", ... }
                if (doc.RootElement.TryGetProperty("completion", out var completion))
                {
                    var text = completion.GetString() ?? string.Empty;
                    return ParseOrWrapText(text);
                }

                // Fallback to try to parse top-level
                return doc;
            }
            catch (JsonException)
            {
                return ParseOrWrapText(respText);
            }
        }

        private JsonDocument ParseOrWrapText(string text)
        {
            // Try parse as JSON first
            try
            {
                return JsonDocument.Parse(text);
            }
            catch (JsonException)
            {
                // Return wrapper object containing the raw text
                var safe = JsonSerializer.Serialize(new { result = text, metadata = new { } });
                return JsonDocument.Parse(safe);
            }
        }
    }
}
