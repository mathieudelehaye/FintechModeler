#include<EuropeanOption/BinomialEuropeanOption.h>
#include <math_utilities.h>

double BinomialEuropeanCallOption::calculateExpectation(
    const PricingModelParameters& parameters,
    const ModelInternalParameters& internalParams) {

    double option_price = 0;

    for (int i = internalParams.cRRThresholdIndex; i <= parameters.period_number; ++i) {
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