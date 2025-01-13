#include "fintech_library.h"

#include <cmath>

static unsigned long long factorial(unsigned int n) {
    unsigned long long result = 1;
    for (unsigned int i = n; i > 0; --i) {
        result *= i;
    }
    return result;
}

static unsigned long long binomial_coef(unsigned int N, unsigned int r) {
    const unsigned long long result = factorial(N) / (factorial(r) * factorial(N-r));
    return result;
}

static double int_power(double base, int exponent) {
    double result = base;
    for (int i = 0; i < exponent - 1; ++i) {
        result *= base;
    }
    return result;
}

// TODO: refactor arguments into a struct
static unsigned int findCRRStartIndex(
    double initial_price, 
    double strike_price, 
    int period_number, 
    double up_move_coef, 
    double down_move_coef) {

    double expiry_price = 0;

    unsigned int i = 3;
    for (i = 0; i < period_number; ++i) {
        const double up_mul_factor = int_power(up_move_coef, i);
        const double down_mul_factor = int_power(down_move_coef, period_number - i);

        expiry_price = initial_price * up_mul_factor * down_mul_factor;

        if (expiry_price > strike_price) {
            break;
        }
    }

    return i; 
}

// TODO: refactor arguments into a struct
static double calculateCRRCallOptionInitialPrice(
    double initial_share_price,
    double strike_price,
    int period_number,
    int start_period,
    double up_move_coef,
    double down_move_coef,
    double up_move_rn_proba,
    double down_move_rn_proba,
    double discrete_rf_rate) {

    double option_price = 0;

    for (int i = start_period; i <= period_number; ++i) {
        const unsigned long long bc = binomial_coef(period_number, i);
        const double up_move_rn_proba_mul_factor = int_power(up_move_rn_proba, i);
        const double down_move_rn_proba_mul_factor = int_power(down_move_rn_proba, period_number - i);

        const double up_mul_factor = int_power(up_move_coef, i);
        const double down_mul_factor = int_power(down_move_coef, period_number - i);

        option_price += bc * up_move_rn_proba_mul_factor * down_move_rn_proba_mul_factor * \
            (initial_share_price * up_mul_factor * down_mul_factor - strike_price);
    }

    const double discountFactor = 1 / int_power(1 + discrete_rf_rate, period_number);

    option_price *= discountFactor;

    return option_price;
}

double PriceEuropeanCallOption() {
    const double volatility = 0.30;
    const double continuous_rf_rate = 0.05;
    const double expiry_time = static_cast<double>(1) / 12;
    const int period_number = 8;    
    const double initial_share_price = 100;
    const double strike_price = 105;

    const double period_time = expiry_time / period_number;
    const double discrete_rf_rate = std::exp(continuous_rf_rate * period_time) - 1;
    const double up_move_mul_coef = std::exp(volatility * std::sqrt(period_time));
    const double down_move_mul_coef = std::exp(- volatility * std::sqrt(period_time));

    const double up_move_rn_proba = (1 + discrete_rf_rate - down_move_mul_coef) / (up_move_mul_coef - down_move_mul_coef);
    const double down_move_rn_proba = 1 - up_move_rn_proba;

    const int cRRStartIndex = findCRRStartIndex(
        initial_share_price,
        strike_price,
        period_number,
        up_move_mul_coef,
        down_move_mul_coef);

    const double callOptionPrice = calculateCRRCallOptionInitialPrice(
        initial_share_price,
        strike_price,
        period_number,
        cRRStartIndex,
        up_move_mul_coef,
        down_move_mul_coef,
        up_move_rn_proba,
        down_move_rn_proba,
        discrete_rf_rate
    );

    return callOptionPrice;
}