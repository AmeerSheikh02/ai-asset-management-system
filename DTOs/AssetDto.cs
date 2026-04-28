namespace AssetManagementAPI.DTOs
{
    public class CreateAssetDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string AssetType { get; set; } = string.Empty;
        public decimal PurchasePrice { get; set; }
        public DateTime PurchaseDate { get; set; }
        public string? Location { get; set; }
    }

    public class UpdateAssetDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? AssetType { get; set; }
        public decimal? PurchasePrice { get; set; }
        public string? Status { get; set; }
        public string? Location { get; set; }
    }

    public class AssetDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string AssetType { get; set; } = string.Empty;
        public decimal PurchasePrice { get; set; }
        public DateTime PurchaseDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Location { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
