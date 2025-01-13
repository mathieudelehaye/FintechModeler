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
    //oss << "The message is: " << GetMessageFromLib() << "\n";
    oss << "The message is: " << PriceEuropeanCallOption() << "\n";    
    logToVSOutput(oss.str());
}

