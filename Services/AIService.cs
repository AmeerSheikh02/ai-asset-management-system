using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using System.Text.RegularExpressions;
using AssetManagementAPI.DTOs;

namespace AssetManagementAPI.Services
{
    public class AIService : IAIService
    {
        private readonly IAssetQueryService _assetQueryService;
        private readonly ILLMService _llmService;
        private readonly ILogger<AIService> _logger;

        public AIService(IAssetQueryService assetQueryService, ILLMService llmService, ILogger<AIService> logger)
        {
            _assetQueryService = assetQueryService;
            _llmService = llmService;
            _logger = logger;
        }

        public async Task<AiQueryResponseDto> QueryAssetsAsync(string query, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                throw new ArgumentException("Query is required.", nameof(query));
            }

            var normalizedQuery = query.Trim();
            var ruleCriteria = ParseRuleBasedCriteria(normalizedQuery);
            var usedRuleBased = HasAnyFilter(ruleCriteria);
            var ruleResults = usedRuleBased
                ? await _assetQueryService.SearchAsync(ruleCriteria, cancellationToken)
                : [];

            var shouldFallbackToLlm = !usedRuleBased || ruleResults.Count == 0;
            var usedLlm = false;
            var merged = ruleResults.ToDictionary(asset => asset.Id);

            if (shouldFallbackToLlm)
            {
                var llmCriteria = await GetLlmCriteriaAsync(normalizedQuery, cancellationToken);
                if (llmCriteria != null && HasAnyFilter(llmCriteria))
                {
                    usedLlm = true;
                    var llmResults = await _assetQueryService.SearchAsync(llmCriteria, cancellationToken);
                    foreach (var asset in llmResults)
                    {
                        merged[asset.Id] = asset;
                    }
                }
            }

            var assets = merged.Values.OrderBy(asset => asset.Name).ThenBy(asset => asset.Id).ToList();
            var strategy = usedRuleBased && usedLlm
                ? "hybrid"
                : usedLlm
                    ? "llm-fallback"
                    : "rule-based";

            var explanation = BuildExplanation(usedRuleBased, usedLlm, ruleResults.Count, assets.Count);

            var result = assets.Count == 0
                ? $"No assets matched the query '{normalizedQuery}'."
                : $"Found {assets.Count} asset{(assets.Count == 1 ? string.Empty : "s")} for '{normalizedQuery}' via {strategy}.";

            return new AiQueryResponseDto
            {
                Result = result,
                Assets = assets,
                Explanation = explanation,
                UsedRuleBased = usedRuleBased,
                UsedLlm = usedLlm,
                Strategy = strategy
            };
        }

        private static string BuildExplanation(bool usedRuleBased, bool usedLlm, int ruleResultCount, int finalResultCount)
        {
            if (usedRuleBased && usedLlm)
            {
                return $"Query was processed with a hybrid flow: rule-based parsing ran first ({ruleResultCount} match{(ruleResultCount == 1 ? string.Empty : "es")}), then LLM fallback expanded/clarified filters and merged results ({finalResultCount} total).";
            }

            if (usedLlm)
            {
                return "Rule-based parsing was insufficient or produced no matches, so LLM parsing was used to generate structured filters.";
            }

            return "Query was handled entirely by deterministic rule-based parsing.";
        }

        private static AssetQueryCriteria ParseRuleBasedCriteria(string query)
        {
            var lower = query.ToLowerInvariant();
            var criteria = new AssetQueryCriteria { Limit = 50 };

            var statuses = new List<string>();
            if (lower.Contains("damaged")) statuses.Add("Damaged");
            if (lower.Contains("inactive")) statuses.Add("Inactive");
            if (lower.Contains("retired")) statuses.Add("Retired");
            if (lower.Contains("active") && !lower.Contains("inactive")) statuses.Add("Active");
            if (statuses.Count > 0)
            {
                criteria.Statuses = statuses.Distinct(StringComparer.OrdinalIgnoreCase).ToList();
            }

            if (lower.Contains("computer")) criteria.AssetType = "Computer";
            if (lower.Contains("furniture")) criteria.AssetType = "Furniture";
            if (lower.Contains("av equipment") || lower.Contains("projector")) criteria.AssetType = "AV Equipment";

            var locationMatch = Regex.Match(query, "(?:in|at)\\s+([A-Za-z0-9\\-\\s]{2,80})", RegexOptions.IgnoreCase);
            if (locationMatch.Success)
            {
                criteria.LocationContains = locationMatch.Groups[1].Value.Trim();
            }

            var minPriceMatch = Regex.Match(lower, "(?:over|above|greater than|more than)\\s*\\$?(\\d+(?:\\.\\d+)?)", RegexOptions.IgnoreCase);
            if (minPriceMatch.Success && decimal.TryParse(minPriceMatch.Groups[1].Value, out var minPrice))
            {
                criteria.MinPurchasePrice = minPrice;
            }

            var maxPriceMatch = Regex.Match(lower, "(?:under|below|less than)\\s*\\$?(\\d+(?:\\.\\d+)?)", RegexOptions.IgnoreCase);
            if (maxPriceMatch.Success && decimal.TryParse(maxPriceMatch.Groups[1].Value, out var maxPrice))
            {
                criteria.MaxPurchasePrice = maxPrice;
            }

            if (!HasAnyFilter(criteria))
            {
                // Try simple name search as a final deterministic rule pass.
                if (query.Length >= 3)
                {
                    criteria.NameContains = query;
                }
            }

            return criteria.Normalize();
        }

        private async Task<AssetQueryCriteria?> GetLlmCriteriaAsync(string query, CancellationToken cancellationToken)
        {
            var llmPrompt =
                "Convert the user request into JSON only using this schema: " +
                "{ \"result\": string, \"metadata\": { \"criteria\": { \"nameContains\": string|null, \"descriptionContains\": string|null, \"assetType\": string|null, \"locationContains\": string|null, \"statuses\": string[]|null, \"minPurchasePrice\": number|null, \"maxPurchasePrice\": number|null, \"purchasedAfter\": string|null, \"purchasedBefore\": string|null, \"limit\": number|null } } }. " +
                "Only use statuses Active, Damaged, Inactive, Retired. If unknown, keep fields null. User request: " + query;

            try
            {
                using var llmDoc = await _llmService.QueryAsync(llmPrompt, cancellationToken);
                if (!llmDoc.RootElement.TryGetProperty("metadata", out var metadata) ||
                    !metadata.TryGetProperty("criteria", out var criteriaElement) ||
                    criteriaElement.ValueKind != JsonValueKind.Object)
                {
                    return null;
                }

                var criteria = JsonSerializer.Deserialize<AssetQueryCriteria>(
                    criteriaElement.GetRawText(),
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (criteria == null)
                {
                    return null;
                }

                var normalized = criteria.Normalize();
                if (!IsValidCriteria(normalized, out var validationErrors))
                {
                    _logger.LogWarning("Ignoring invalid LLM criteria for query '{Query}': {Errors}", query, string.Join(" | ", validationErrors));
                    return null;
                }

                return normalized;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "LLM fallback failed for query '{Query}'", query);
                return null;
            }
        }

        private static bool IsValidCriteria(AssetQueryCriteria criteria, out List<string> errors)
        {
            var validationResults = new List<ValidationResult>();
            var context = new ValidationContext(criteria);
            var isValid = Validator.TryValidateObject(criteria, context, validationResults, true);
            errors = validationResults.Select(result => result.ErrorMessage ?? "Invalid criteria").ToList();
            return isValid;
        }

        private static bool HasAnyFilter(AssetQueryCriteria criteria)
        {
            return !string.IsNullOrWhiteSpace(criteria.NameContains)
                   || !string.IsNullOrWhiteSpace(criteria.DescriptionContains)
                   || !string.IsNullOrWhiteSpace(criteria.AssetType)
                   || !string.IsNullOrWhiteSpace(criteria.LocationContains)
                   || (criteria.Statuses is { Count: > 0 })
                   || criteria.MinPurchasePrice.HasValue
                   || criteria.MaxPurchasePrice.HasValue
                   || criteria.PurchasedAfter.HasValue
                   || criteria.PurchasedBefore.HasValue;
        }
    }
}
