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

    // Helper function for stable binomial coefficient calculation
    static double log_factorial(unsigned int n) {
        double result = 0.0;
        for (unsigned int i = 2; i <= n; ++i) {
            result += std::log(static_cast<double>(i));
        }
        return result;
    }

    unsigned long long binomial_coef(unsigned int n, unsigned int k) {
        if (k > n/2) {
            k = n - k;
        }
        
        if (k == 0) {
            return 1;
        }
        
        if (k == 1) {
            return n;
        }

        if (n <= 20) {
            unsigned long long result = 1;
            for (unsigned int i = 1; i <= k; ++i) {
                result = result * (n - k + i) / i;
            }
            return result;
        }

        double log_result = log_factorial(n) - log_factorial(k) - log_factorial(n - k);
        return std::round(std::exp(log_result));
    }

    double int_power(double base, int exponent) {
        if (exponent == 0) {
            return 1;
        }

        bool is_negative = exponent < 0;
        int abs_exponent = std::abs(exponent);
        
        double result = 1.0;
        double current_power = base;
        int remaining_power = abs_exponent;
        
        while (remaining_power > 0) {
            if (remaining_power & 1) {
                result *= current_power;
            }
            current_power *= current_power;
            remaining_power >>= 1;
        }

        return is_negative ? 1.0 / result : result;
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

    static double run_newton_step(const std::function<double(double)>& f, double x, double dx) {
        return x - f(x) / differentiate(f, x, dx);
    }

    double find_newton_root(const std::function<double(double)>& f, double x, double tol) {
        double previous_root = 0.0;
        double current_root = x;

        do {
            previous_root = current_root;
            current_root = run_newton_step(f, x, 0.001);
        } while (std::abs(current_root - previous_root) > tol);

        return current_root;
    }
}