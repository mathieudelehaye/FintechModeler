#include "fintech_library.h"
#include <EuropeanOption/BinomialEuropeanOption.h>
#include <EuropeanOption/BSEuropeanOption.h>

#include <cstdio>

namespace {

// Internal helpers remain C++ linkage
static double PriceBinomialEuropeanOption(
    const EuropeanOption::PricingModelParameters& parameters,
    int type)
{
    std::fprintf(stderr,
        "PriceBinomialEuropeanOption: tree depth=%d, strike=%f\n",
        parameters.period_number, parameters.strike_price);

    double result = 0;
    if (type == 0) {
        BinomialEuropeanCallOption option(parameters);
        result = option.calculateInitialPrice();
    } else {
        BinomialEuropeanPutOption option(parameters);
        result = option.calculateInitialPrice();
    }
    return result;
}

static double PriceBSEuropeanOption(
    const EuropeanOption::PricingModelParameters& parameters,
    int type)
{
    double result = 0;
    if (type == 0) {
        BSEuropeanCallOption option(parameters);
        result = option.calculateInitialPrice();
    } else {
        BSEuropeanPutOption option(parameters);
        result = option.calculateInitialPrice();
    }
    return result;
}

} // end anonymous namespace

extern "C" {

MYLIBRARY_API double CALLING_CONVENTION PriceEuropeanOption(
    int type,
    int method,
    double expiry_time,
    int period_number,
    double volatility,
    double continuous_rf_rate,
    double initial_share_price,
    double strike_price)
{
    EuropeanOption::PricingModelParameters parameters{};
    parameters.expiry_time          = expiry_time;
    parameters.period_number        = period_number;
    parameters.volatility          = volatility;
    parameters.continuous_rf_rate  = continuous_rf_rate;
    parameters.initial_share_price = initial_share_price;
    parameters.strike_price        = strike_price;

    std::fprintf(stderr, " ? About to call %s pricing\n",
        (method == 0) ? "Binomial" : "Black-Scholes");

    if (method == 0) {
        return PriceBinomialEuropeanOption(parameters, type);
    } else {
        return PriceBSEuropeanOption(parameters, type);
    }
}

MYLIBRARY_API double CALLING_CONVENTION CalculateBSImpliedVolatility(
    double option_market_price,
    int type,
    double expiry_time,
    double continuous_rf_rate,
    double strike_price,
    double initial_share_price)
{
    EuropeanOption::PricingModelParameters parameters{};
    parameters.expiry_time          = expiry_time;
    parameters.volatility           = 0.0;  // not used here
    parameters.continuous_rf_rate  = continuous_rf_rate;
    parameters.initial_share_price = initial_share_price;
    parameters.strike_price        = strike_price;

    if (type == 0) {
        BSEuropeanCallOption option(parameters);
        return option.calculateImpliedVolatility(option_market_price);
    } else {
        BSEuropeanPutOption option(parameters);
        return option.calculateImpliedVolatility(option_market_price);
    }
}

} // extern "C"
