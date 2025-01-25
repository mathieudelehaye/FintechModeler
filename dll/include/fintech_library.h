#pragma once

#ifdef MYLIBRARY_EXPORTS
#define MYLIBRARY_API __declspec(dllexport)
#else
#define MYLIBRARY_API __declspec(dllimport)
#endif

extern "C" {
    enum OptionType
    {
        Call = 0,
        Put= 1
    };

    enum CalculationMethod
    {
        Binomial = 0,
        BS = 1
    };

    MYLIBRARY_API double PriceEuropeanOption(
        OptionType type,
        CalculationMethod method,
        double expiry_time,
        int period_number,
        double volatility,
        double continuous_rf_rate,
        double initial_share_price,
        double strike_price);
}
