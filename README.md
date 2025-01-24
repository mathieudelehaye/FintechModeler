# FintechModeler

## Summary 

The application is deployed on Azure: https://nice-mud-07fe6b603.4.azurestaticapps.net/

A financial and fintech application developed with:
- C++ (calculation and pricing)
- Python (data analysis)
- C# with ASP.NET (REST API backend)
- TypeScript with React (frontend).

It calculates the price of European-style call options using an exponentiated biased lattice random walk within a multi-period binomial tree model.

<kbd>
  <img src="screenshots/screenshot01.png" height ="502" width="669" hspace="10" />
</kbd>

## Additional Features

- Black-Scholes Model Implementation: accurately prices European call options based on the underlying stock price, strike price, and expiration date.
- Real-Time Financial Data Access: retrieves and analyses stock price variability using live data from the Yahoo Finance API.
- Data Analysis: uses Python's Pandas, NumPy, and Matplotlib for financial modeling and visualisation.

These features enable accurate option price predictions, aligning closely with real-world results from Saxo Bank (SaxoTraderGO): https://www.home.saxo/platforms/saxotradergo

<kbd>
  <img src="screenshots/screenshot02.png" height ="444" width="800" hspace="10" />
</kbd>

<br/>

## Details

The implementation is made both in C++, Python with pandas and NumPy, as well as in C# and TypeScript, in order to compare the runtime performance of those programming languages for fintech applications.

## How-to guide

First, run some unit tests:
```
clear; python -m unittest -v tests.test_variability_assesser
```

Then build the C++ dynamic library:
```
cd <project root>
clear; g++ -shared -I cpp/include -std=c++17 -o cpp/build/operations.dylib -fPIC cpp/common/operations.cpp cpp/common/statistics_calculator.cpp 
```

Start the backend:
```
python run.py
```

Fetch the variability from the backend REST API:
```
curl 'http://localhost:5000/variability?start_month=6&end_month=2&stock_name=AAPL'
```

Start the frontend:
```
cd frontend
npm start
```

Manually calculate and plot the variability:
```
python
>>> import scripts.functions as f
>>> f.plot_variability('AAPL')
```

