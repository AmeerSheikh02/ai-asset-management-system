namespace AssetManagementAPI.DTOs
{
    public class AssetSummaryDto
    {
        public int TotalAssets { get; set; }
        public int DamagedAssets { get; set; }
        public int InactiveAssets { get; set; }
    }
}