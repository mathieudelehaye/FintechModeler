#include <fintech_library.h>

#include <EuropeanOption/BinomialEuropeanOption.h>

double PriceEuropeanOption(
    OptionType type,
    double expiry_time,
    int period_number,
    double volatility,
    double continuous_rf_rate,
    double initial_share_price,
    double strike_price) {

    EuropeanOption::PricingModelParameters parameters{};
    parameters.option_type = static_cast<EuropeanOption::Type>(type);
    parameters.expiry_time = expiry_time;
    parameters.period_number = period_number;
    parameters.volatility = volatility;
    parameters.continuous_rf_rate = continuous_rf_rate;
    parameters.initial_share_price = initial_share_price;
    parameters.strike_price = strike_price;

    double result = 0;

    switch (parameters.option_type) {
    case EuropeanOption::Type::Call:
    {
        BinomialEuropeanCallOption option(parameters); 
        result = option.calculateInitialPrice();
        break;
    }
    default:
    {
        BinomialEuropeanPutOption option(parameters);
        result = option.calculateInitialPrice();
        break;
    }
    };

    return result;
}