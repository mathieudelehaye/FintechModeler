#include <fintech_library.h>

#include <EuropeanOption/BinomialEuropeanOption.h>
#include <EuropeanOption/BSEuropeanOption.h>

static double PriceBinomialEuropeanOption(const EuropeanOption::PricingModelParameters& parameters, OptionType type) {
    double result = 0;

    switch (type) {
    case OptionType::Call:
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

static double PriceBSEuropeanOption(const EuropeanOption::PricingModelParameters& parameters, OptionType type) {
    double result = 0;

    switch (type) {
    case OptionType::Call:
    {
        BSEuropeanCallOption option(parameters);
        result = option.calculateInitialPrice();
        break;
    }
    default:
    {
        BSEuropeanPutOption option(parameters);
        result = option.calculateInitialPrice();
        break;
    }
    };

    return result;
}

double PriceEuropeanOption(
    OptionType type,
    CalculationMethod method,
    double expiry_time,
    int period_number,
    double volatility,
    double continuous_rf_rate,
    double initial_share_price,
    double strike_price) {

    EuropeanOption::PricingModelParameters parameters{};
    parameters.expiry_time = expiry_time;
    parameters.period_number = period_number;
    parameters.volatility = volatility;
    parameters.continuous_rf_rate = continuous_rf_rate;
    parameters.initial_share_price = initial_share_price;
    parameters.strike_price = strike_price;

    double result = 0;

    switch (method) {
    case Binomial:
    {
        result = PriceBinomialEuropeanOption(parameters, type);
        break;
    }
    default:
    {
        result = PriceBSEuropeanOption(parameters, type);
        break;
    }
    };

    return result; 
}

double CalculateBSImpliedVolatility(
    double option_market_price,
    OptionType type,
    double expiry_time,
    double continuous_rf_rate,
    double initial_share_price,
    double strike_price) {

    EuropeanOption::PricingModelParameters parameters{};
    parameters.expiry_time = expiry_time;
    parameters.volatility = 0; // not used here
    parameters.continuous_rf_rate = continuous_rf_rate;
    parameters.initial_share_price = initial_share_price;
    parameters.strike_price = strike_price;

    double result = 0;

    switch (type) {
    case OptionType::Call:
    {
        BSEuropeanCallOption option(parameters);
        result = option.calculateImpliedVolatility(option_market_price);
        break;
    }
    default:
    {
        BSEuropeanPutOption option(parameters);
        result = option.calculateImpliedVolatility(option_market_price);
        break;
    }
    };

    return result;
}