using System.ComponentModel.DataAnnotations;

namespace AssetManagementAPI.DTOs
{
    public class AssetQueryCriteria : IValidatableObject
    {
        private static readonly HashSet<string> AllowedStatuses = new(StringComparer.OrdinalIgnoreCase)
        {
            "Active",
            "Damaged",
            "Inactive",
            "Retired"
        };

        [StringLength(200)]
        public string? NameContains { get; set; }

        [StringLength(500)]
        public string? DescriptionContains { get; set; }

        [StringLength(200)]
        public string? AssetType { get; set; }

        [StringLength(200)]
        public string? LocationContains { get; set; }

        public List<string>? Statuses { get; set; }

        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal? MinPurchasePrice { get; set; }

        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal? MaxPurchasePrice { get; set; }

        public DateTime? PurchasedAfter { get; set; }

        public DateTime? PurchasedBefore { get; set; }

        [Range(1, 100)]
        public int? Limit { get; set; }

        public AssetQueryCriteria Normalize()
        {
            return new AssetQueryCriteria
            {
                NameContains = string.IsNullOrWhiteSpace(NameContains) ? null : NameContains.Trim(),
                DescriptionContains = string.IsNullOrWhiteSpace(DescriptionContains) ? null : DescriptionContains.Trim(),
                AssetType = string.IsNullOrWhiteSpace(AssetType) ? null : AssetType.Trim(),
                LocationContains = string.IsNullOrWhiteSpace(LocationContains) ? null : LocationContains.Trim(),
                Statuses = Statuses?
                    .Where(status => !string.IsNullOrWhiteSpace(status))
                    .Select(status => status.Trim())
                    .Distinct(StringComparer.OrdinalIgnoreCase)
                    .ToList(),
                MinPurchasePrice = MinPurchasePrice,
                MaxPurchasePrice = MaxPurchasePrice,
                PurchasedAfter = PurchasedAfter,
                PurchasedBefore = PurchasedBefore,
                Limit = Limit
            };
        }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (Statuses is { Count: > 0 })
            {
                var invalidStatuses = Statuses
                    .Where(status => !string.IsNullOrWhiteSpace(status) && !AllowedStatuses.Contains(status.Trim()))
                    .Distinct(StringComparer.OrdinalIgnoreCase)
                    .ToArray();

                if (invalidStatuses.Length > 0)
                {
                    yield return new ValidationResult(
                        $"Unsupported status value(s): {string.Join(", ", invalidStatuses)}. Allowed values are: {string.Join(", ", AllowedStatuses.OrderBy(value => value))}.",
                        [nameof(Statuses)]);
                }
            }

            if (MinPurchasePrice.HasValue && MaxPurchasePrice.HasValue && MinPurchasePrice > MaxPurchasePrice)
            {
                yield return new ValidationResult(
                    "MinPurchasePrice cannot be greater than MaxPurchasePrice.",
                    [nameof(MinPurchasePrice), nameof(MaxPurchasePrice)]);
            }

            if (PurchasedAfter.HasValue && PurchasedBefore.HasValue && PurchasedAfter > PurchasedBefore)
            {
                yield return new ValidationResult(
                    "PurchasedAfter cannot be later than PurchasedBefore.",
                    [nameof(PurchasedAfter), nameof(PurchasedBefore)]);
            }

            if (Limit.HasValue && (Limit < 1 || Limit > 100))
            {
                yield return new ValidationResult(
                    "Limit must be between 1 and 100.",
                    [nameof(Limit)]);
            }
        }
    }
}
