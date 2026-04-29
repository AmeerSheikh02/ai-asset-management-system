using AssetManagementAPI.Data;
using AssetManagementAPI.DTOs;
using AssetManagementAPI.Models;

namespace AssetManagementAPI.Services
{
    public class AssetQueryService : IAssetQueryService
    {
        private readonly IAssetRepository _assetRepository;

        public AssetQueryService(IAssetRepository assetRepository)
        {
            _assetRepository = assetRepository;
        }

        public async Task<IReadOnlyList<AssetDto>> SearchAsync(AssetQueryCriteria criteria, CancellationToken cancellationToken = default)
        {
            ArgumentNullException.ThrowIfNull(criteria);

            var assets = await _assetRepository.SearchAssetsAsync(criteria, cancellationToken);
            return assets.Select(MapToDto).ToList();
        }

        private static AssetDto MapToDto(Asset asset)
        {
            return new AssetDto
            {
                Id = asset.Id,
                Name = asset.Name,
                Description = asset.Description,
                AssetType = asset.AssetType,
                PurchasePrice = asset.PurchasePrice,
                PurchaseDate = asset.PurchaseDate,
                Status = asset.Status,
                Location = asset.Location,
                CreatedAt = asset.CreatedAt,
                UpdatedAt = asset.UpdatedAt
            };
        }
    }
}
