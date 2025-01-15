#include <EuropeanCallOption.h>

#include <math_utilities.h>

#include <cmath>

double EuropeanCallOption::calculatePrice() {
    const double period_time = parameters.expiry_time / parameters.period_number;

    ModelInternalParameters internalParams{};

    internalParams.discrete_rf_rate = std::exp(parameters.continuous_rf_rate * period_time) - 1;
    internalParams.up_move_mul_coef = std::exp(parameters.volatility * std::sqrt(period_time));
    internalParams.down_move_mul_coef = std::exp(-parameters.volatility * std::sqrt(period_time));
    internalParams.up_move_rn_proba = (1 + internalParams.discrete_rf_rate \
        - internalParams.down_move_mul_coef) / (internalParams.up_move_mul_coef \
            - internalParams.down_move_mul_coef);
    internalParams.down_move_rn_proba = 1 - internalParams.up_move_rn_proba;

    internalParams.cRRStartIndex = findCRRStartIndex(
        parameters,
        internalParams);

    const double callOptionPrice = calculateCRRCallOptionInitialPrice(
        parameters,
        internalParams
    );

    return callOptionPrice;
}

unsigned int EuropeanCallOption::findCRRStartIndex(
    const PricingModelParameters& parameters,
    const ModelInternalParameters& internalParams) {

    double expiry_price = 0;

    unsigned int i = 3;
    for (i = 0; i < parameters.period_number; ++i) {
        const double up_mul_factor = MathUtilities::int_power(internalParams.up_move_mul_coef, i);
        const double down_mul_factor = MathUtilities::int_power(internalParams.down_move_mul_coef, parameters.period_number - i);

        expiry_price = parameters.initial_share_price * up_mul_factor * down_mul_factor;

        if (expiry_price > parameters.strike_price) {
            break;
        }
    }

    return i;
}

double EuropeanCallOption::calculateCRRCallOptionInitialPrice(
    const PricingModelParameters& parameters,
    const ModelInternalParameters& internalParams) {

    double option_price = 0;

    for (int i = internalParams.cRRStartIndex; i <= parameters.period_number; ++i) {
        const unsigned long long bc = MathUtilities::binomial_coef(parameters.period_number, i);
        const double up_move_proba_mul_factor = MathUtilities::int_power(internalParams.up_move_rn_proba, i);
        const double down_move_proba_mul_factor = MathUtilities::int_power(internalParams.down_move_rn_proba, parameters.period_number - i);
        const double payoff_proba = bc * up_move_proba_mul_factor * down_move_proba_mul_factor;

        const double up_move_price_mul_factor = MathUtilities::int_power(internalParams.up_move_mul_coef, i);
        const double down_move_price_mul_factor = MathUtilities::int_power(internalParams.down_move_mul_coef, parameters.period_number - i);
        const double expiry_share_price = parameters.initial_share_price * up_move_price_mul_factor * down_move_price_mul_factor;

        const double payoff_value = expiry_share_price - parameters.strike_price;

        option_price += payoff_proba * payoff_value;
    }

    const double discountFactor = 1 / MathUtilities::int_power(1 + internalParams.discrete_rf_rate, parameters.period_number);

    option_price *= discountFactor;

    return option_price;
}