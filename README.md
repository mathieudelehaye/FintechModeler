# FintechModeler
A Python and C++ library for fintech modeling. It implements the Black-Scholes model, in order to price call option derivatives, according to the underlying stock price, the strike price and expiration date. 

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
