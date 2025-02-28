﻿namespace backend.Models
{
    public class OptionPricingParameters
    {
        public string? Type { get; set; }
        public string? Method { get; set; }
        public double ExpiryTime { get; set; }
        public int PeriodNumber { get; set; }
        public double Volatility { get; set; }
        public double ContinuousRfRate { get; set; }
        public double InitialSharePrice { get; set; }
        public double StrikePrice { get; set; }
    }
}
