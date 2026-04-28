using AssetManagementAPI.Models;

namespace AssetManagementAPI.Data
{
    public interface IAssetRepository
    {
        Task<Asset?> GetAssetByIdAsync(int id);
        Task<IEnumerable<Asset>> GetAllAssetsAsync();
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
