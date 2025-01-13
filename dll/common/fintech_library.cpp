#include "fintech_library.h"

#include <cmath>

int Add(int a, int b) {
    return a + b;
}

const char* GetMessageFromLib() {
    return "Hello from C++ DLL modified!";
}

static unsigned long long factorial(unsigned int n) {
    unsigned long long result = 1;
    for (unsigned int i = 1; i <= n; ++i) {
        result *= i;
    }
    return result;
}

static unsigned long long binomial_coef(unsigned int N, unsigned int r) {
    return factorial(N) / (factorial(r) * factorial(N-r));
}

static double int_power(double base, int exponent) {
    double result = base;
    for (unsigned int i = 0; i < exponent - 1; ++i) {
        result *= result;
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
        //i = period_number;

        /*expiry_price = initial_price * binomial_coef(period_number, i) * \
            int_power(up_move_coef, i) * int_power(down_move_coef, period_number - i);*/

        expiry_price = initial_price * binomial_coef(period_number, i) * \
            int_power(up_move_coef, i);

        //return expiry_price;

        if (expiry_price > strike_price) {
            return 49;
            //break;
        }
    }

    return i; //int_power(3, 2);
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

    return cRRStartIndex;
}