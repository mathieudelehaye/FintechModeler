namespace backend.Models
{
    public class ImpliedVolatilityParameters
    {
        public double InitialOptionPrice { get; set; }
        public string? Type { get; set; }
        public double ExpiryTime { get; set; }
        public double ContinuousRfRate { get; set; }
        public double InitialSharePrice { get; set; }
        public double StrikePrice { get; set; }
    }
}
