// dllExecutable.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include <sstream>
#include <string>
#include <windows.h>

#include "fintech_library.h"

void logToVSOutput(const std::string& message) {
    std::wstring wideMessage(message.begin(), message.end());
    OutputDebugString(wideMessage.c_str());
}

int main() {
    HWND consoleWindow = GetConsoleWindow(); 
    ShowWindow(consoleWindow, SW_HIDE);    
    OutputDebugString(L"Console window hidden.\n");

    std::ostringstream oss;

    const double expiry_time = 2;
    const int period_number = 8;
    const double volatility = 0.30;
    const double continuous_rf_rate = 0.02;
    const double initial_share_price = 100;
    const double strike_price = 105;

    const double calculatedPrice = PriceEuropeanCallOption(
        expiry_time,
        period_number,
        volatility,
        continuous_rf_rate,
        initial_share_price,
        strike_price);

    oss << "The calculated price is: " << calculatedPrice << "\n";
    logToVSOutput(oss.str());
}

