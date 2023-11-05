# 
# functions.py
# 
# Created by Mathieu Delehaye on 1/11/2023.
# 
# FintechModeler: A Python and C++ library for fintech modeling.
# 
# Copyright © 2023 Mathieu Delehaye. All rights reserved.
# 
# 
# This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General
# Public License as published by
# the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
# warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
# 
# You should have received a copy of the GNU Affero General Public License along with this program. If not, see
# <https:www.gnu.org/licenses/>.

from py.variability_assesser import VariabilityAssesser
from scipy.stats import norm

import ctypes
import numpy as np
import unittest

N = norm.cdf

def bs_call(S, K, T, r, sigma):
    """
    Calculate the value of a call option.

    Args:
        S (float): The underlying asset current price.
        K (float): The strike price. 
        T (float): The time before expiration [year].
        r (float): The risk-free interest rate.
        sigma (float): The underlying asset price variability.
    
    Returns:
        float: The option price.
    """
    d1 = (np.log(S/K) + (r + sigma**2/2)*T) / (sigma*np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    return S * N(d1) - K * np.exp(-r*T)* N(d2)

def bs_put(S, K, T, r, sigma):
    """
    Calculate the value of a put option.

    Args:
        S (float): The underlying asset current price.
        K (float): The strike price. 
        T (float): The time before expiration [year].
        r (float): The risk-free interest rate.
        sigma (float): The underlying asset price variability.
    
    Returns:
        float: The option price.
    """
    d1 = (np.log(S/K) + (r + sigma**2/2)*T) / (sigma*np.sqrt(T))
    d2 = d1 - sigma* np.sqrt(T)
    return K*np.exp(-r*T)*N(-d2) - S*N(-d1)

def plot_variability(stock_name, hide_plot=False):
    """
    Compute and plot the rolling variability, based on the Yahoo 
        Finance data of the `pandas-datareader` library.

    Args:
        stock_name (str): The name of the stock for which the price
            variability must be plot.
        hide_plot (bool, optional): Set to True to hide the plot, 
            e.g. for unit-testing the method. 
    """
    assesser = VariabilityAssesser()
    assesser.plot_variability(stock_name, hide_plot=hide_plot)

def cpp_operations_call():
    """
    Call a function defined in a dynamic library compiled from C/C++.
    """

    # Load the C++ library
    operations_lib = ctypes.CDLL('./cpp/build/operations.dylib')

    # Call the 'add_integers' function
    OPERAND_1=5
    OPERAND_2=3
    result=operations_lib.add_integers(OPERAND_1, OPERAND_2)
    print(f"{OPERAND_1}+{OPERAND_2}={result}")

    # Call the 'compute_variability' function
    # Create a Python list of double values
    double_array = [ 1, 2, 4, 6 ]
    print(f"X={double_array}")

    # Convert the Python list to a C array
    c_double_array = (ctypes.c_double * len(double_array))(*double_array)

    # Specify the return value type
    operations_lib.compute_variability.restype = ctypes.c_double

    sigma={operations_lib.compute_variability(c_double_array, len(double_array))}
    print(f"sigma(X)={sigma}")
