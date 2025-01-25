#pragma once

#include <EuropeanOption/EuropeanOption.h>

class BinomialEuropeanOption : public EuropeanOption {
public:
    BinomialEuropeanOption(const PricingModelParameters& params) : EuropeanOption(params) {}

    double calculateInitialPrice() override;

protected:
    struct ModelInternalParameters {
        double discrete_rf_rate;
        double up_move_mul_coef;
        double down_move_mul_coef;
        double up_move_rn_proba;
        double down_move_rn_proba;
        int cRRThresholdIndex;
    };

    unsigned int findThresholdIndex(const PricingModelParameters& parameters, const ModelInternalParameters& internalParams);

    virtual double calculateExpectation(const PricingModelParameters& parameters, const ModelInternalParameters& internalParams) = 0;
};


class BinomialEuropeanCallOption : public BinomialEuropeanOption {
public:
    BinomialEuropeanCallOption(const PricingModelParameters& params)
        : BinomialEuropeanOption(params) {
    }

private:
    double calculateExpectation(const PricingModelParameters& parameters, const ModelInternalParameters& internalParams);
};


class BinomialEuropeanPutOption : public BinomialEuropeanOption {
public:
    BinomialEuropeanPutOption(const PricingModelParameters& params)
        : BinomialEuropeanOption(params) {
    }

private:
    double calculateExpectation(const PricingModelParameters& parameters, const ModelInternalParameters& internalParams);
};