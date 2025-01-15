#pragma once

#ifdef MYLIBRARY_EXPORTS
#define MYLIBRARY_API __declspec(dllexport)
#else
#define MYLIBRARY_API __declspec(dllimport)
#endif

extern "C" {
    MYLIBRARY_API double PriceEuropeanCallOption(
        double expiry_time,
        int period_number,
        double volatility,
        double continuous_rf_rate,
        double initial_share_price,
        double strike_price);
}
