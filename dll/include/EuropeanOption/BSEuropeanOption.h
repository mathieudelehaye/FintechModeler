#pragma once

#include <EuropeanOption/EuropeanOption.h>


class BSEuropeanCallOption : public EuropeanOption {
public:
    BSEuropeanCallOption(const PricingModelParameters& params) : EuropeanOption(params) {}

    double calculateInitialPrice() override;
}; 


class BSEuropeanPutOption : public EuropeanOption {
public:
    BSEuropeanPutOption(const PricingModelParameters& params) : EuropeanOption(params) {}

    double calculateInitialPrice() override;
};