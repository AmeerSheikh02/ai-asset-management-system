using AssetManagementAPI.DTOs;
using AssetManagementAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssetsController : ControllerBase
    {
        private readonly IAssetService _assetService;
        private readonly ILogger<AssetsController> _logger;

        public AssetsController(IAssetService assetService, ILogger<AssetsController> logger)
        {
            _assetService = assetService;
            _logger = logger;
        }

        /// <summary>
        /// Get all assets
        /// </summary>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<AssetDto>>> GetAllAssets()
        {
            _logger.LogInformation("Fetching all assets");
            var assets = await _assetService.GetAllAssetsAsync();
            return Ok(assets);
        }

        /// <summary>
        /// Get asset by ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<AssetDto>> GetAssetById(int id)
        {
            _logger.LogInformation($"Fetching asset with ID: {id}");
            var asset = await _assetService.GetAssetByIdAsync(id);
            
            if (asset == null)
            {
                _logger.LogWarning($"Asset with ID: {id} not found");
                return NotFound();
            }
            
            return Ok(asset);
        }

        /// <summary>
        /// Create a new asset
        /// </summary>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<AssetDto>> CreateAsset([FromBody] CreateAssetDto createDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _logger.LogInformation("Creating new asset");
            var asset = await _assetService.CreateAssetAsync(createDto);
            
            return CreatedAtAction(nameof(GetAssetById), new { id = asset.Id }, asset);
        }

        /// <summary>
        /// Update an existing asset
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<AssetDto>> UpdateAsset(int id, [FromBody] UpdateAssetDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _logger.LogInformation($"Updating asset with ID: {id}");
            var asset = await _assetService.UpdateAssetAsync(id, updateDto);
            
            if (asset == null)
            {
                _logger.LogWarning($"Asset with ID: {id} not found");
                return NotFound();
            }
            
            return Ok(asset);
        }

        /// <summary>
        /// Delete an asset
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteAsset(int id)
        {
            _logger.LogInformation($"Deleting asset with ID: {id}");
            var result = await _assetService.DeleteAssetAsync(id);
            
            if (!result)
            {
                _logger.LogWarning($"Asset with ID: {id} not found");
                return NotFound();
            }
            
            return NoContent();
        }
    }
}
