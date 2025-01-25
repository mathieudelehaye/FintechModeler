#pragma once

#include <EuropeanOption/EuropeanOption.h>

class BSEuropeanOption : public EuropeanOption {
public:
    BSEuropeanOption(const PricingModelParameters& params) : EuropeanOption(params) {}

    double calculateInitialPrice() override;
};