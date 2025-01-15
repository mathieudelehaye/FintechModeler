#include <fintech_library.h>

#include <EuropeanCallOption.h>

double PriceEuropeanCallOption(
    double expiry_time,
    int period_number,
    double volatility,
    double continuous_rf_rate,
    double initial_share_price,
    double strike_price) {

    EuropeanCallOption::PricingModelParameters parameters{};
    parameters.expiry_time = expiry_time;
    parameters.period_number = period_number;
    parameters.volatility = volatility;
    parameters.continuous_rf_rate = continuous_rf_rate;
    parameters.initial_share_price = initial_share_price;
    parameters.strike_price = strike_price;

    EuropeanCallOption option(parameters); 
    return option.calculatePrice();
}