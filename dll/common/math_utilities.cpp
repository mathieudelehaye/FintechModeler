# include <math_utilities.h>

#include <cmath>
#include <functional>

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
    
    double n(double z) {
        return differentiate(N, z);
    }

    double differentiate(const std::function<double(double)>& f, double x, double dx) {
        return (f(x + dx) - f(x)) / dx;
    }

    static double run_newton_step(const std::function<double(double)>& f, double x) {
        return x - f(x) / differentiate(f, x);
    }

    double find_newton_root(const std::function<double(double)>& f, double x, double tol = 0.01) {
        double previous_root = 0.0;
        double current_root = x;

        do {
            previous_root = current_root;
            current_root = run_newton_step(f, x);
        } while (std::abs(current_root - previous_root) > tol);

        return current_root;
    }
}