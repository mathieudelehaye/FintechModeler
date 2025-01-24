#
# functions.py
#
# Created by Mathieu Delehaye on 4/11/2023.
#
# FintechModeler: A Python and C++ library for fintech modeling.
#
# Copyright © 2023 Mathieu Delehaye. All rights reserved.
#
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General
# Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied
# warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
# for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see
# <https:www.gnu.org/licenses/>.

from datetime import datetime
from enum import Enum, auto
from scripts.variability_assesser import VariabilityAssesser
from scipy.stats import norm

import ctypes
import numpy as np
import os
import unittest

N = norm.cdf


class ImplementationMethod(Enum):
    """
    List of methods to implement an algorithm.
    """

    Python = "Python"
    Cpp = "C/C++"


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
    d1 = (np.log(S / K) + (r + sigma**2 / 2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    return S * N(d1) - K * np.exp(-r * T) * N(d2)


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
    d1 = (np.log(S / K) + (r + sigma**2 / 2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    return K * np.exp(-r * T) * N(-d2) - S * N(-d1)


def stock_price_variability(
    stock_name, implementations=[ImplementationMethod.Python], hide_plot=False
):
    """
    Compute and plot the rolling variability, based on the Yahoo
        Finance data of the `pandas-datareader` library.
    This function and the functions it calls is purely implemented
        in Python.

    Args:
        stock_name (str): The name of the stock for which the price
            variability must be plot.
        implementations (list, optional): List of enum items of type
            `ImplementationMethod`, which represent the methods to implement the
            varability calculation. Default value: [ImplementationMethod.Python]
        hide_plot (bool, optional): Set to True to hide the plot,
            e.g. for unit-testing the method. Default value: False

    Returns:
        dict: A dictionary with the calculated variabilities for different methods:
            - They key is of ImplementationMethod type and represents the implementation
            method
            - The value is of float type and represents the variability.
    """
    assesser = VariabilityAssesser(stock_name)

    # Read the data
    assesser.read_stock_price(2)

    # Compute the variabilities with different methods
    before_calculation_timestamp = 0
    after_calculation_timestamp = 0

    res = dict()

    for implementation in implementations:
        res[implementation] = (
            python_stock_price_variability(assesser)
            if implementation == ImplementationMethod.Python
            else cpp_stock_price_variability(assesser)
        )

        # Plot the results
        if not hide_plot:
            assesser.plot_variability()

    return res


def python_stock_price_variability(assesser):
    """
    Calculate the stock price variability using the Python implementation
    method.

    Args:
        assesser (VariabilityAssesser): The object used to provide the input data.
            The method `read_stock_price` must have been called on this object.

    Returns:
        float: The calculated variability.
    """

    before_calculation_timestamp = datetime.now()
    variability = assesser.compute_variability()
    after_calculation_timestamp = datetime.now()

    print(
        f"Calculation duration for Python method: "
        f"{(after_calculation_timestamp - before_calculation_timestamp).total_seconds() * 1000} ms"
    )

    return variability


def cpp_stock_price_variability(assesser):
    """
    Calculate the stock price variability using the C/C++ implementation
    method.

    Args:
        assesser (VariabilityAssesser): The object used to provide the input data.
            The method `read_stock_price` must have been called on this object.

    Returns:
        Returns:
            float: The calculated variability.
    """
    # Load the C++ library
    current_dir = os.path.dirname(os.path.abspath(__file__))
    operations_lib = ctypes.CDLL(f"{current_dir}/../../cpp/build/operations.dylib")

    input_array = assesser.stock_prices()["Adj Close"].to_list()
    # print(f"X={input_array}")

    data_number = len(input_array)
    # print(f"data_number={data_number}")

    # Convert the Python list to a C array
    c_double_input_array = (ctypes.c_double * data_number)(*input_array)

    # Create a C array for output values
    c_double_output_array = (ctypes.c_double * data_number)()
    for i in range(len(c_double_output_array)):
        c_double_output_array[i] = 0

    # Specify the return value type
    operations_lib.compute_variability.restype = ctypes.c_double

    before_calculation_timestamp = datetime.now()
    variability = operations_lib.compute_variability(
        c_double_input_array, c_double_output_array, data_number
    )
    after_calculation_timestamp = datetime.now()

    print(
        f"Calculation duration for C/C++ method: "
        f"{(after_calculation_timestamp - before_calculation_timestamp).total_seconds() * 1000} ms"
    )

    print("sigma(X)=")
    # for i in range(len(c_double_output_array)):
    #     print(f"c_double_output_array[i]={c_double_output_array[i]}")
    assesser.import_variability(c_double_output_array)

    return variability


def cpp_operations_call():
    """
    Call a function defined in a dynamic library compiled from C/C++.
    """

    # Load the C++ library
    current_dir = os.path.dirname(os.path.abspath(__file__))
    operations_lib = ctypes.CDLL(f"{current_dir}/../../cpp/build/operations.dylib")

    # Call the 'add_integers' function
    OPERAND_1 = 5
    OPERAND_2 = 3
    result = operations_lib.add_integers(OPERAND_1, OPERAND_2)
    print(f"{OPERAND_1}+{OPERAND_2}={result}")
