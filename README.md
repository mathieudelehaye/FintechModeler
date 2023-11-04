# FintechModeler
A Python and C++ library for fintech modeling.

First, built the C++ dynamic library:
```
cd <project root>
g++ -shared -o cpp/build/operations.dylib -fPIC cpp/operations.cpp
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
