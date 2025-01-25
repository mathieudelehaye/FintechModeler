#pragma once

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

    virtual double calculateInitialPrice() = 0;

    virtual ~EuropeanOption() = default;

protected:
    PricingModelParameters parameters;
};