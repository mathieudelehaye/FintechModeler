package org.example.fintechmodeler.nativeapi;

import com.sun.jna.Library;
import com.sun.jna.Native;

public interface FintechModelLibrary extends Library {
    FintechModelLibrary INSTANCE = Native.load("fintech_model", FintechModelLibrary.class);

    double PriceEuropeanOption(
        int optionType,           // 0 for Call, 1 for Put
        int calculationMethod,    // 0 for Binomial, 1 for BS
        double expiryTime,
        int periodNumber,
        double volatility,
        double continuousRfRate,
        double initialSharePrice,
        double strikePrice
    );

    double CalculateBSImpliedVolatility(
        double optionMarketPrice,
        int optionType,          // 0 for Call, 1 for Put
        double expiryTime,
        double continuousRfRate,
        double strikePrice,
        double initialSharePrice
    );
}
