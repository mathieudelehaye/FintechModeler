#pragma once

#include <EuropeanOption/EuropeanOption.h>


class BSEuropeanOption : public EuropeanOption {
public:
    BSEuropeanOption(const PricingModelParameters& params);

    double calculateVegaGreek();
    double calculateImpliedVolatility(double optionPrice);

protected:
    struct ModelInternalParameters {
        double d1;
        double d2;
    };

    ModelInternalParameters internalParameters;

private:
    void updateInternalParameters();
};


class BSEuropeanCallOption : public BSEuropeanOption {
public:
    BSEuropeanCallOption(const PricingModelParameters& params) : BSEuropeanOption(params) {}

    double calculateInitialPrice() override;
}; 


class BSEuropeanPutOption : public BSEuropeanOption {
public:
    BSEuropeanPutOption(const PricingModelParameters& params) : BSEuropeanOption(params) {}

    double calculateInitialPrice() override;
};