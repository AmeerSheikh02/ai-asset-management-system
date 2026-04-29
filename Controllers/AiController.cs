using AssetManagementAPI.DTOs;
using AssetManagementAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagementAPI.Controllers
{
    [ApiController]
    [Route("api/ai")]
    public class AiController : ControllerBase
    {
        private readonly IAssetService _assetService;
        private readonly IAssetQueryService _assetQueryService;
        private readonly IAIService _aiService;
        private readonly ILogger<AiController> _logger;

        public AiController(IAssetService assetService, IAssetQueryService assetQueryService, IAIService aiService, ILogger<AiController> logger)
        {
            _assetService = assetService;
            _assetQueryService = assetQueryService;
            _aiService = aiService;
            _logger = logger;
        }

        [HttpGet("summary")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<AssetSummaryDto>> GetSummary()
        {
            var assets = await _assetService.GetAllAssetsAsync();

            var summary = new AssetSummaryDto
            {
                TotalAssets = assets.Count(),
                DamagedAssets = assets.Count(asset => string.Equals(asset.Status, "Damaged", StringComparison.OrdinalIgnoreCase)),
                InactiveAssets = assets.Count(asset =>
                    string.Equals(asset.Status, "Inactive", StringComparison.OrdinalIgnoreCase) ||
                    string.Equals(asset.Status, "Retired", StringComparison.OrdinalIgnoreCase))
            };

            return Ok(summary);
        }

        [HttpPost("query")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<object>> Query([FromBody] AiQueryRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Query))
            {
                return BadRequest(new { message = "Query is required." });
            }

            var response = await _aiService.QueryAssetsAsync(request.Query, HttpContext.RequestAborted);
            return Ok(new
            {
                filteredData = response.Assets,
                explanation = response.Explanation,
                strategy = response.Strategy,
                result = response.Result
            });
        }

        [HttpPost("query/structured")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<object>> QueryStructured([FromBody] AssetQueryCriteria criteria)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var normalized = criteria.Normalize();
            var matchedAssets = await _assetQueryService.SearchAsync(normalized);

            var result = matchedAssets.Count == 0
                ? "No assets matched the structured query."
                : $"Found {matchedAssets.Count} asset{(matchedAssets.Count == 1 ? string.Empty : "s")} for the structured query.";

            return Ok(new { result, assets = matchedAssets });
        }

        public sealed class AiQueryRequest
        {
            public string Query { get; set; } = string.Empty;
        }
    }
}