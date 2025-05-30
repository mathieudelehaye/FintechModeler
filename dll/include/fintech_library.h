#pragma once

#ifdef MYLIBRARY_EXPORTS
#define MYLIBRARY_API __declspec(dllexport)
#else
#define MYLIBRARY_API __declspec(dllimport)
#endif

#define CALLING_CONVENTION __stdcall

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

    MYLIBRARY_API double CALLING_CONVENTION PriceEuropeanOption(
        int type,               // Using int instead of enum for better interop
        int method,            // Using int instead of enum for better interop
        double expiry_time,
        int period_number,
        double volatility,
        double continuous_rf_rate,
        double initial_share_price,
        double strike_price);

    MYLIBRARY_API double CALLING_CONVENTION CalculateBSImpliedVolatility(
        double option_market_price,
        int type,              // Using int instead of enum for better interop
        double expiry_time,
        double continuous_rf_rate,
        double strike_price,
        double initial_share_price);
}
