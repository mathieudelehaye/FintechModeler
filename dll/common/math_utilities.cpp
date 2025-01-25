#include <cmath>

namespace MathUtilities {
    unsigned long long factorial(unsigned int n) {
        unsigned long long result = 1;
        for (unsigned int i = n; i > 0; --i) {
            result *= i;
        }
        return result;
    }

    unsigned long long binomial_coef(unsigned int N, unsigned int r) {
        const unsigned long long result = factorial(N) / (factorial(r) * factorial(N - r));
        return result;
    }

    double int_power(double base, int exponent) {
        if (exponent == 0) {
            return 1;
        }

        double result = base;
        for (int i = 0; i < exponent - 1; ++i) {
            result *= base;
        }
        return result;
    }

    double N(double z) {
        return 0.5 * (1.0 + std::erf(z / std::sqrt(2.0)));
    }
}