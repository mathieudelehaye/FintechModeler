#pragma once

#include <functional>

namespace MathUtilities {
    unsigned long long factorial(unsigned int n);
    unsigned long long binomial_coef(unsigned int N, unsigned int r);
    double int_power(double base, int exponent);
    double N(double z);
    double n(double z);
    double differentiate(const std::function<double(double)>& f, double x, double dx = 0.00001);
    double find_newton_root(const std::function<double(double)>& f, double x, double tol);
}