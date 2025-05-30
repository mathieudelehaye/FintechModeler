#include <EuropeanOption/BinomialEuropeanOption.h>
#include <math_utilities.h>
#include <cmath>

double BinomialEuropeanOption::calculateInitialPrice() {
    const double period_time = parameters.expiry_time / parameters.period_number;

    ModelInternalParameters internalParams{};

    internalParams.discrete_rf_rate = std::exp(parameters.continuous_rf_rate * period_time) - 1;

    internalParams.up_move_mul_coef = std::exp(parameters.volatility * std::sqrt(period_time));
    internalParams.down_move_mul_coef = std::exp(-parameters.volatility * std::sqrt(period_time));

    internalParams.up_move_rn_proba = (1 + internalParams.discrete_rf_rate \
        - internalParams.down_move_mul_coef) / (internalParams.up_move_mul_coef \
            - internalParams.down_move_mul_coef);
    internalParams.down_move_rn_proba = 1 - internalParams.up_move_rn_proba;

    internalParams.cRRThresholdIndex = findThresholdIndex(
        parameters,
        internalParams);

    const double callOptionPrice = calculateExpectation(
        parameters,
        internalParams
    );

    return callOptionPrice;
}

unsigned int BinomialEuropeanOption::findThresholdIndex(
    const PricingModelParameters& parameters,
    const ModelInternalParameters& internalParams) {

    double expiry_price = 0;
    int threshold_index = 0;

    for (int i = 0; i <= parameters.period_number; ++i) {
        const double up_mul_factor = MathUtilities::int_power(internalParams.up_move_mul_coef, i);
        const double down_mul_factor = MathUtilities::int_power(internalParams.down_move_mul_coef, parameters.period_number - i);

        expiry_price = parameters.initial_share_price * up_mul_factor * down_mul_factor;

        if (expiry_price > parameters.strike_price) {
            threshold_index = i;
            break;
        }
    }

    return threshold_index;
}