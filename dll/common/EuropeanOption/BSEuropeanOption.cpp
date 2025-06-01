#include <EuropeanOption/BSEuropeanOption.h>

#include <math_utilities.h>

#include <cmath>
#include <fstream>

// Comment out this line to disable debug logging
// #define DEBUG_IMPLIED_VOL

BSEuropeanOption::BSEuropeanOption(const PricingModelParameters& params) : EuropeanOption(params) {
    updateInternalParameters();
}

double BSEuropeanOption::calculateVegaGreek() {
    return MathUtilities::n(internalParameters.d1) * parameters.initial_share_price * std::sqrt(parameters.expiry_time);
}

double BSEuropeanOption::calculateImpliedVolatility(double marketPrice) {
    #ifdef DEBUG_IMPLIED_VOL
    std::ofstream logFile("implied_vol_debug.log", std::ios::app);
    logFile << "\n\nNew implied volatility calculation:\n";
    logFile << "Market price: " << marketPrice << "\n";
    logFile << "Initial share price: " << parameters.initial_share_price << "\n";
    logFile << "Strike price: " << parameters.strike_price << "\n";
    logFile << "Time to maturity: " << parameters.expiry_time << "\n";
    logFile << "Risk-free rate: " << parameters.continuous_rf_rate << "\n";
    #endif

    // Use current market price to estimate initial volatility guess
    double moneyness = parameters.initial_share_price / parameters.strike_price;
    double timeToMaturity = parameters.expiry_time;
    
    // Initial guess based on Brenner-Subrahmanyam approximation for ATM options
    const double PI = 3.14159265358979323846;
    double initialGuess = std::sqrt(2 * PI / timeToMaturity) * (marketPrice / parameters.initial_share_price);
    if (initialGuess < 0.001 || !std::isfinite(initialGuess)) {
        initialGuess = 0.2;  // Default to 20% if approximation fails
    }
    
    #ifdef DEBUG_IMPLIED_VOL
    logFile << "Initial guess: " << initialGuess << "\n";
    #endif
    
    auto optionPriceDifference = [this, marketPrice](double vol) -> double {
        if (vol <= 0.0) return 1e6;  // Avoid negative or zero volatility
        this->parameters.volatility = vol;
        updateInternalParameters();
        return this->calculateInitialPrice() - marketPrice;
    };

    // Custom Newton-Raphson implementation using vega
    double currentVol = initialGuess;
    const int MAX_ITERATIONS = 100;
    const double PRICE_TOL = 1e-8;
    const double VOL_TOL = 1e-8;
    
    for (int i = 0; i < MAX_ITERATIONS; ++i) {
        this->parameters.volatility = currentVol;
        updateInternalParameters();
        
        double price = calculateInitialPrice();
        double diff = price - marketPrice;
        double vega = calculateVegaGreek();
        
        #ifdef DEBUG_IMPLIED_VOL
        logFile << "Iteration " << i << ": vol=" << currentVol 
                << ", price=" << price << ", target=" << marketPrice 
                << ", diff=" << diff << ", vega=" << vega 
                << ", d1=" << internalParameters.d1 
                << ", d2=" << internalParameters.d2 << "\n";
        #endif
        
        if (std::abs(diff) < PRICE_TOL) {
            #ifdef DEBUG_IMPLIED_VOL
            logFile << "Converged on price difference\n";
            #endif
            break;
        }
        
        if (std::abs(vega) < 1e-10) {
            #ifdef DEBUG_IMPLIED_VOL
            logFile << "Stopping due to small vega\n";
            #endif
            break;
        }
        
        double newVol = currentVol - diff / vega;
        
        // Ensure volatility stays positive and reasonable
        if (newVol <= 0.0) {
            newVol = currentVol / 2.0;
            #ifdef DEBUG_IMPLIED_VOL
            logFile << "Negative vol, halving to " << newVol << "\n";
            #endif
        }
        if (newVol > 5.0) {
            newVol = 5.0;
            #ifdef DEBUG_IMPLIED_VOL
            logFile << "Capping vol at 5.0\n";
            #endif
        }
        
        if (std::abs(newVol - currentVol) < VOL_TOL) {
            #ifdef DEBUG_IMPLIED_VOL
            logFile << "Converged on volatility change\n";
            #endif
            break;
        }
        
        currentVol = newVol;
    }
    
    #ifdef DEBUG_IMPLIED_VOL
    logFile << "Final implied volatility: " << currentVol << "\n";
    logFile.close();
    #endif

    return currentVol;
}

void BSEuropeanOption::updateInternalParameters() {
    internalParameters.d1 = (std::log(parameters.initial_share_price / parameters.strike_price) + 
                           (parameters.continuous_rf_rate + 0.5 * parameters.volatility * parameters.volatility) * parameters.expiry_time) / 
                           (parameters.volatility * std::sqrt(parameters.expiry_time));

    internalParameters.d2 = internalParameters.d1 - parameters.volatility * std::sqrt(parameters.expiry_time);
}

double BSEuropeanCallOption::calculateInitialPrice() {
    return parameters.initial_share_price * MathUtilities::N(internalParameters.d1) - 
           parameters.strike_price * std::exp(-parameters.continuous_rf_rate * parameters.expiry_time) * MathUtilities::N(internalParameters.d2);
}

double BSEuropeanPutOption::calculateInitialPrice() {
    return - parameters.initial_share_price * MathUtilities::N(-internalParameters.d1) + 
           parameters.strike_price * std::exp(-parameters.continuous_rf_rate * parameters.expiry_time) * MathUtilities::N(-internalParameters.d2);
}