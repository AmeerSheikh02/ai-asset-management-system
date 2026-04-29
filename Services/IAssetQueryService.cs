using AssetManagementAPI.DTOs;

namespace AssetManagementAPI.Services
{
    public interface IAssetQueryService
    {
        Task<IReadOnlyList<AssetDto>> SearchAsync(AssetQueryCriteria criteria, CancellationToken cancellationToken = default);
    }
}
