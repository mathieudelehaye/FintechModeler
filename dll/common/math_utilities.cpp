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
        return static_cast<unsigned long long>(std::round(std::exp(log_result)));
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
        const double SQRT_2PI = 2.506628274631000502415765284811;  // sqrt(2*pi)
        return std::exp(-0.5 * z * z) / SQRT_2PI;
    }

    double differentiate(const std::function<double(double)>& f, double x, double dx) {
        return (f(x + dx) - f(x)) / dx;
    }

    static double run_newton_step(const std::function<double(double)>& f, double x, double dx) {
        double derivative = differentiate(f, x, dx);
        if (std::abs(derivative) < 1e-10) {  // Avoid division by very small numbers
            return x;
        }
        return x - f(x) / derivative;
    }

    double find_newton_root(const std::function<double(double)>& f, double x, double tol) {
        const int MAX_ITERATIONS = 100;
        const double DX = 1e-7;  // Smaller step size for more precise derivatives
        const double MIN_DIFF = 1e-10;  // Minimum function value difference

        double current_root = x;
        int iterations = 0;

        while (iterations < MAX_ITERATIONS) {
            double f_value = f(current_root);
            
            // Check if we're close enough to the root
            if (std::abs(f_value) < tol) {
                break;
            }

            double next_root = run_newton_step(f, current_root, DX);
            
            // Check for convergence
            if (std::abs(next_root - current_root) < MIN_DIFF) {
                break;
            }

            // Check for divergence
            if (!std::isfinite(next_root)) {
                return current_root;
            }

            current_root = next_root;
            iterations++;
        }

        return current_root;
    }
}