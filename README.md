# FintechModeler
A Python and C++ application for fintech modeling. 

It implements the Black-Scholes model, in order to price call option derivatives, according to the underlying stock price, the strike price and the expiration date. 

The stock price variability is assessed using data from the Yahoo Finance API.

The implementation is made both in Python with pandas and numpy, as well as in C++, in order to compare the runtime performance of those programming languages for fintech applications.

This app let me predict with a good accuracy the results from Saxo bank (SaxoTraderGO): https://www.home.saxo/platforms/saxotradergo

## How-to guide

First, build the C++ dynamic library:
```
cd <project root>
clear; g++ -shared -I cpp/include -std=c++17 -o cpp/build/operations.dylib -fPIC cpp/common/operations.cpp cpp/common/statistics_calculator.cpp 
```

Then, run some unit tests:
```
clear; python3.11 ./py/test/test_functions.py
```

To manually calculate and plot the variability:
```
python3.11 
>>> import py.functions as f
>>> f.plot_variability('AAPL')
```

<p float="left">
  <img src="screenshots/screenshot01.png" height ="502" width="590" hspace="10" />
</p>
