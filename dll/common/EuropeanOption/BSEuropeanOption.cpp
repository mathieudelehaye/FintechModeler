#include <EuropeanOption/BSEuropeanOption.h>

#include <math_utilities.h>

#include <cmath>

double BSEuropeanCallOption::calculateInitialPrice() {
    double d1 = (std::log(parameters.initial_share_price / parameters.strike_price) + (parameters.continuous_rf_rate + 0.5 * parameters.volatility * parameters.volatility) * parameters.expiry_time) / (parameters.volatility * std::sqrt(parameters.expiry_time));
    double d2 = d1 - parameters.volatility * std::sqrt(parameters.expiry_time);

    return parameters.initial_share_price * MathUtilities::N(d1) - parameters.strike_price * std::exp(-parameters.continuous_rf_rate * parameters.expiry_time) * MathUtilities::N(d2);
}

double BSEuropeanPutOption::calculateInitialPrice() {
    double d1 = (std::log(parameters.initial_share_price / parameters.strike_price) + (parameters.continuous_rf_rate + 0.5 * parameters.volatility * parameters.volatility) * parameters.expiry_time) / (parameters.volatility * std::sqrt(parameters.expiry_time));
    double d2 = d1 - parameters.volatility * std::sqrt(parameters.expiry_time);

    return - parameters.initial_share_price * MathUtilities::N(- d1) + parameters.strike_price * std::exp(-parameters.continuous_rf_rate * parameters.expiry_time) * MathUtilities::N(- d2);

    return 1.0;
}