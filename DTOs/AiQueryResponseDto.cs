namespace AssetManagementAPI.DTOs
{
    public class AiQueryResponseDto
    {
        public string Result { get; set; } = string.Empty;
        public List<AssetDto> Assets { get; set; } = [];
        public string Explanation { get; set; } = string.Empty;
        public bool UsedRuleBased { get; set; }
        public bool UsedLlm { get; set; }
        public string Strategy { get; set; } = "rule-based";
    }
}
