#pragma once

#include <fintech_library.h>

class EuropeanOption {
public:
    enum class Type {
        Call,
        Put
    };

    struct PricingModelParameters {
        Type option_type;
        double expiry_time;
        int period_number;
        double volatility;
        double continuous_rf_rate;
        double initial_share_price;
        double strike_price;
    };

    EuropeanOption(const PricingModelParameters& params) : parameters(params) {}

    double calculatePrice();

    virtual ~EuropeanOption() = default;

protected:
    PricingModelParameters parameters;

    struct ModelInternalParameters {
        double discrete_rf_rate;
        double up_move_mul_coef;
        double down_move_mul_coef;
        double up_move_rn_proba;
        double down_move_rn_proba;
        int cRRThresholdIndex;
    };

    unsigned int findCRRThresholdIndex(const PricingModelParameters& parameters, const ModelInternalParameters& internalParams);

    virtual double calculateCRROptionInitialPrice(const PricingModelParameters& parameters, const ModelInternalParameters& internalParams) = 0;
};


class EuropeanCallOption : public EuropeanOption {
public:
    EuropeanCallOption(const PricingModelParameters& params)
        : EuropeanOption(params) {
    }

private:
    double calculateCRROptionInitialPrice(const PricingModelParameters& parameters, const ModelInternalParameters& internalParams) override;
};


class EuropeanPutOption : public EuropeanOption {
public:
    EuropeanPutOption(const PricingModelParameters& params)
        : EuropeanOption(params) {
    }

private:
    double calculateCRROptionInitialPrice(const PricingModelParameters& parameters, const ModelInternalParameters& internalParams) override;
};