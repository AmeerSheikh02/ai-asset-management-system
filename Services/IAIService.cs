using AssetManagementAPI.DTOs;

namespace AssetManagementAPI.Services
{
    public interface IAIService
    {
        Task<AiQueryResponseDto> QueryAssetsAsync(string query, CancellationToken cancellationToken = default);
    }
}
