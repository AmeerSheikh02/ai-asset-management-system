using AssetManagementAPI.Models;
using AssetManagementAPI.DTOs;
using Microsoft.EntityFrameworkCore;

namespace AssetManagementAPI.Data
{
    public interface IAssetRepository
    {
        Task<Asset?> GetAssetByIdAsync(int id);
        Task<IEnumerable<Asset>> GetAllAssetsAsync();
        Task<IReadOnlyList<Asset>> SearchAssetsAsync(AssetQueryCriteria criteria, CancellationToken cancellationToken = default);
        Task<Asset> CreateAssetAsync(Asset asset);
        Task<Asset> UpdateAssetAsync(Asset asset);
        Task<bool> DeleteAssetAsync(int id);
    }

    public class AssetRepository : IAssetRepository
    {
        private readonly ApplicationDbContext _context;

        public AssetRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Asset?> GetAssetByIdAsync(int id)
        {
            return await _context.Assets.FindAsync(id);
        }

        public async Task<IEnumerable<Asset>> GetAllAssetsAsync()
        {
            return await Task.FromResult(_context.Assets.ToList());
        }

        public async Task<IReadOnlyList<Asset>> SearchAssetsAsync(AssetQueryCriteria criteria, CancellationToken cancellationToken = default)
        {
            var normalized = criteria.Normalize();

            IQueryable<Asset> query = _context.Assets.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(normalized.NameContains))
            {
                var nameTerm = normalized.NameContains;
                query = query.Where(asset => asset.Name.Contains(nameTerm));
            }

            if (!string.IsNullOrWhiteSpace(normalized.DescriptionContains))
            {
                var descriptionTerm = normalized.DescriptionContains;
                query = query.Where(asset => asset.Description.Contains(descriptionTerm));
            }

            if (!string.IsNullOrWhiteSpace(normalized.AssetType))
            {
                var assetType = normalized.AssetType;
                query = query.Where(asset => asset.AssetType == assetType);
            }

            if (!string.IsNullOrWhiteSpace(normalized.LocationContains))
            {
                var locationTerm = normalized.LocationContains;
                query = query.Where(asset => asset.Location != null && asset.Location.Contains(locationTerm));
            }

            if (normalized.Statuses is { Count: > 0 })
            {
                var statuses = normalized.Statuses.ToArray();
                query = query.Where(asset => statuses.Contains(asset.Status));
            }

            if (normalized.MinPurchasePrice.HasValue)
            {
                var minPrice = normalized.MinPurchasePrice.Value;
                query = query.Where(asset => asset.PurchasePrice >= minPrice);
            }

            if (normalized.MaxPurchasePrice.HasValue)
            {
                var maxPrice = normalized.MaxPurchasePrice.Value;
                query = query.Where(asset => asset.PurchasePrice <= maxPrice);
            }

            if (normalized.PurchasedAfter.HasValue)
            {
                var purchasedAfter = normalized.PurchasedAfter.Value;
                query = query.Where(asset => asset.PurchaseDate >= purchasedAfter);
            }

            if (normalized.PurchasedBefore.HasValue)
            {
                var purchasedBefore = normalized.PurchasedBefore.Value;
                query = query.Where(asset => asset.PurchaseDate <= purchasedBefore);
            }

            query = query.OrderBy(asset => asset.Name).ThenBy(asset => asset.Id);

            if (normalized.Limit.HasValue)
            {
                query = query.Take(normalized.Limit.Value);
            }

            return await query.ToListAsync(cancellationToken);
        }

        public async Task<Asset> CreateAssetAsync(Asset asset)
        {
            _context.Assets.Add(asset);
            await _context.SaveChangesAsync();
            return asset;
        }

        public async Task<Asset> UpdateAssetAsync(Asset asset)
        {
            asset.UpdatedAt = DateTime.UtcNow;
            _context.Assets.Update(asset);
            await _context.SaveChangesAsync();
            return asset;
        }

        public async Task<bool> DeleteAssetAsync(int id)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset == null) return false;

            _context.Assets.Remove(asset);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
