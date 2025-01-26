#include <EuropeanOption/BSEuropeanOption.h>

#include <math_utilities.h>

#include <cmath>

BSEuropeanOption::BSEuropeanOption(const PricingModelParameters& params) : EuropeanOption(params) {
    updateInternalParameters();
}

double BSEuropeanOption::calculateVegaGreek() {
    return MathUtilities::n(internalParameters.d1) * parameters.initial_share_price * std::sqrt(parameters.expiry_time);
}

double BSEuropeanOption::calculateImpliedVolatility(double marketPrice) {

    auto optionPriceDifference = [this, marketPrice](double v) -> double {
        this->parameters.volatility = v;
        updateInternalParameters();
        return this->calculateInitialPrice() - marketPrice;
    };

    return MathUtilities::find_newton_root(optionPriceDifference, .1, .00000001);
}

void BSEuropeanOption::updateInternalParameters() {
    internalParameters.d1 = (std::log(parameters.initial_share_price / parameters.strike_price) + (parameters.continuous_rf_rate + 0.5 * parameters.volatility * parameters.volatility) * parameters.expiry_time) / (parameters.volatility * std::sqrt(parameters.expiry_time));

    internalParameters.d2 = internalParameters.d1 - parameters.volatility * std::sqrt(parameters.expiry_time);
}

double BSEuropeanCallOption::calculateInitialPrice() {
    return parameters.initial_share_price * MathUtilities::N(internalParameters.d1) - parameters.strike_price * std::exp(-parameters.continuous_rf_rate * parameters.expiry_time) * MathUtilities::N(internalParameters.d2);
}

double BSEuropeanPutOption::calculateInitialPrice() {
    return - parameters.initial_share_price * MathUtilities::N(-internalParameters.d1) + parameters.strike_price * std::exp(-parameters.continuous_rf_rate * parameters.expiry_time) * MathUtilities::N(-internalParameters.d2);
}