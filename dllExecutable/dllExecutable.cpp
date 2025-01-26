// dllExecutable.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

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

    const double calculatedPrice = PriceEuropeanOption(
        /*type=*/Call,
        /*method=*/BS,
        /*expiry_time=*/ 2,
        /*period_number=*/ 8,
        /*volatility=*/ 0.30,
        /*continuous_rf_rate=*/ 0.02,
        /*initial_share_price=*/ 100,
        /*strike_price=*/ 105
    );

    oss << "The calculated price is: " << calculatedPrice << "\n";
    logToVSOutput(oss.str());
}
