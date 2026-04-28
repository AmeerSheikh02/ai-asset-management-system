using AssetManagementAPI.DTOs;
using AssetManagementAPI.Models;
using AssetManagementAPI.Data;

namespace AssetManagementAPI.Services
{
    public interface IAssetService
    {
        Task<AssetDto?> GetAssetByIdAsync(int id);
        Task<IEnumerable<AssetDto>> GetAllAssetsAsync();
        Task<AssetDto> CreateAssetAsync(CreateAssetDto createDto);
        Task<AssetDto?> UpdateAssetAsync(int id, UpdateAssetDto updateDto);
        Task<bool> DeleteAssetAsync(int id);
    }

    public class AssetService : IAssetService
    {
        private readonly IAssetRepository _repository;

        public AssetService(IAssetRepository repository)
        {
            _repository = repository;
        }

        public async Task<AssetDto?> GetAssetByIdAsync(int id)
        {
            var asset = await _repository.GetAssetByIdAsync(id);
            return asset == null ? null : MapToDto(asset);
        }

        public async Task<IEnumerable<AssetDto>> GetAllAssetsAsync()
        {
            var assets = await _repository.GetAllAssetsAsync();
            return assets.Select(MapToDto).ToList();
        }

        public async Task<AssetDto> CreateAssetAsync(CreateAssetDto createDto)
        {
            var asset = new Asset
            {
                Name = createDto.Name,
                Description = createDto.Description,
                AssetType = createDto.AssetType,
                PurchasePrice = createDto.PurchasePrice,
                PurchaseDate = createDto.PurchaseDate,
                Location = createDto.Location,
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            };

            var createdAsset = await _repository.CreateAssetAsync(asset);
            return MapToDto(createdAsset);
        }

        public async Task<AssetDto?> UpdateAssetAsync(int id, UpdateAssetDto updateDto)
        {
            var asset = await _repository.GetAssetByIdAsync(id);
            if (asset == null) return null;

            if (!string.IsNullOrEmpty(updateDto.Name))
                asset.Name = updateDto.Name;
            if (!string.IsNullOrEmpty(updateDto.Description))
                asset.Description = updateDto.Description;
            if (!string.IsNullOrEmpty(updateDto.AssetType))
                asset.AssetType = updateDto.AssetType;
            if (updateDto.PurchasePrice.HasValue)
                asset.PurchasePrice = updateDto.PurchasePrice.Value;
            if (!string.IsNullOrEmpty(updateDto.Status))
                asset.Status = updateDto.Status;
            if (!string.IsNullOrEmpty(updateDto.Location))
                asset.Location = updateDto.Location;

            var updatedAsset = await _repository.UpdateAssetAsync(asset);
            return MapToDto(updatedAsset);
        }

        public async Task<bool> DeleteAssetAsync(int id)
        {
            return await _repository.DeleteAssetAsync(id);
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
