// dllExecutable.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <cassert>
#include <cmath>
#include <iostream>
#include <sstream>
#include <string>
#include <windows.h>

#include <fintech_library.h>

void logToVSOutput(const std::string& message) {
    std::wstring wideMessage(message.begin(), message.end());
    OutputDebugString(wideMessage.c_str());
}

int main() {
    HWND consoleWindow = GetConsoleWindow(); 
    ShowWindow(consoleWindow, SW_HIDE);    
    OutputDebugString(L"Console window hidden.\n");

    std::ostringstream oss;

    const double calculatedPrice01 = std::round(
        PriceEuropeanOption(
            /*type=*/Call,
            /*method=*/BS,
            /*expiry_time=*/ 2,
            /*period_number=*/ 8,
            /*volatility=*/ 0.30,
            /*continuous_rf_rate=*/ 0.02,
            /*initial_share_price=*/ 100,
            /*strike_price=*/ 105
        ) * 100.0) / 100;
    assert(calculatedPrice01 == 16.44);
    oss << "The calculated price for a Call with the BS method is: " << calculatedPrice01 << "\n";
    logToVSOutput(oss.str()); oss.str("");

    const double calculatedPrice02 = std::round(
        PriceEuropeanOption(
            /*type=*/Put,
            /*method=*/Binomial,
            /*expiry_time=*/ 2,
            /*period_number=*/ 8,
            /*volatility=*/ 0.30,
            /*continuous_rf_rate=*/ 0.02,
            /*initial_share_price=*/ 100,
            /*strike_price=*/ 105
        ) * 100.0) / 100;
    assert(calculatedPrice02 == 17.35);
    oss << "The calculated price for a Put with the Binomial method is: " << calculatedPrice02 << "\n";
    logToVSOutput(oss.str()); oss.str("");
    
    const double market_price = 30.95;
    const double impliedVolatiliy = std::round(
        CalculateBSImpliedVolatility(
            /*option_market_price=*/market_price,
            /*type=*/Call,
            /*expiry_time=*/ 0.5,
            /*continuous_rf_rate=*/ 0.0427,
            /*strike_price=*/ 210,
            /*initial_share_price=*/ 227.5
        ) * 100.0) / 100;
    assert(impliedVolatiliy == 0.29);
    oss.clear();
    oss << "The implied volatily for a Call with market price " << market_price << " is: " << impliedVolatiliy << "\n";
    logToVSOutput(oss.str());
}
