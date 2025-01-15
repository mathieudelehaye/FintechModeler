#pragma once

#include <fintech_library.h>

class EuropeanCallOption {
public:
    struct PricingModelParameters {
        double expiry_time;
        int period_number;
        double volatility;
        double continuous_rf_rate;
        double initial_share_price;
        double strike_price;
    };

    EuropeanCallOption(const PricingModelParameters& params) : parameters(params) {}
    double calculatePrice();

private:
    PricingModelParameters parameters;

    struct ModelInternalParameters {
        double discrete_rf_rate;
        double up_move_mul_coef;
        double down_move_mul_coef;
        double up_move_rn_proba;
        double down_move_rn_proba;
        int cRRStartIndex;
    };

    unsigned int findCRRStartIndex(const PricingModelParameters& parameters, const ModelInternalParameters& internalParams);
    double calculateCRRCallOptionInitialPrice(const PricingModelParameters& parameters, const ModelInternalParameters& internalParams);
};