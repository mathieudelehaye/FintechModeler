# 
# test_functions.py
# 
# Created by Mathieu Delehaye on 4/11/2023.
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

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + '/../..') # add the project root path

from datetime import datetime
from dateutil.relativedelta import relativedelta
from py.functions import ImplementationMethod

import math
import py.functions as f
import unittest

class TestFunctions(unittest.TestCase):
    """
    Unit test (UT) class for the functions from the `py.functions` module.
    """

    def test_run(self):
        """
        Test all the functions from the module.

        TODO:
            - Split this unique UT test case (TC) into different methods.
        """
        
        # `stock_price_variability` function. E.g.: 'AV.L' for Aviva LSE, 'AAPL' for Apple NYSE
        res = f.stock_price_variability('AAPL', [ImplementationMethod.Python, ImplementationMethod.Cpp], hide_plot=True)
        
        start_date = datetime.today() - relativedelta(months=6)
        end_date = datetime.today() - relativedelta(days=2)
        variability_sum_lower_limit = 1
        variability_sum_upper_limit = 1000

        # Python implementation for the calculation
        python_res_dict = res[ImplementationMethod.Python]
        python_res_dict_first_key = next(iter(python_res_dict.keys()))
        self.assertEqual(python_res_dict_first_key.strftime("%Y-%m-%d %H:%M:%S"), start_date.strftime("%Y-%m-%d 00:00:00"))
        python_res_dict_last_key = next(reversed(python_res_dict.keys()))
        self.assertEqual(python_res_dict_last_key.strftime("%Y-%m-%d %H:%M:%S"), end_date.strftime("%Y-%m-%d 00:00:00"))
        python_res_dict_values = python_res_dict.values()
        # print([item for item in python_res_dict_values][:50])
        # Only keep the numerical and non-NaN values
        filtered_python_res_dict_values = [item for item in python_res_dict_values 
            if isinstance(item, (int, float)) and not math.isnan(item)]
        variability_sum = sum(filtered_python_res_dict_values)
        self.assertTrue(self._check_value_in_range(variability_sum, variability_sum_lower_limit, variability_sum_upper_limit),
            f"Value {variability_sum} is not in the specified range [{variability_sum_lower_limit}, {variability_sum_upper_limit}]")

        # C++ implementation for the calculation
        cpp_res_dict = res[ImplementationMethod.Cpp]
        cpp_res_dict_first_key = next(iter(cpp_res_dict.keys()))
        self.assertEqual(cpp_res_dict_first_key.strftime("%Y-%m-%d %H:%M:%S"), start_date.strftime("%Y-%m-%d 00:00:00"))
        cpp_res_dict_last_key = next(reversed(cpp_res_dict.keys()))
        self.assertEqual(cpp_res_dict_last_key.strftime("%Y-%m-%d %H:%M:%S"), end_date.strftime("%Y-%m-%d 00:00:00"))
        cpp_res_dict_values = cpp_res_dict.values()
        # print([item for item in cpp_res_dict_values][:50])
        # Only keep the numerical and non-NaN values
        filtered_cpp_res_dict_values = [item for item in cpp_res_dict_values 
            if isinstance(item, (int, float)) and not math.isnan(item)]
        variability_sum = sum(filtered_cpp_res_dict_values)
        self.assertTrue(self._check_value_in_range(variability_sum, variability_sum_lower_limit, variability_sum_upper_limit),
            f"Value {variability_sum} is not in the specified range [{variability_sum_lower_limit}, {variability_sum_upper_limit}]")

        # `bs_call` function
        stock_price=186
        expiration_days=5
        interest_rate=.0525
        # self.assertEqual(round(f.bs_call(stock_price, 180, expiration_days/365, interest_rate, .190118), 2), 570.50) 
        
        print(f"Strike\tStock\tExp. [d]\tCall")
        strike_prices=[180,182.5,185,187.5,190,192.5]
        for strike_price in strike_prices:
            call_price=round(f.bs_call(stock_price, strike_price, expiration_days/365, interest_rate, .190118), 2)
            print(f"{strike_price}\t{stock_price}\t{expiration_days}\t{call_price}")

        # `bs_put` function
        self.assertEqual(round(f.bs_put(10218, 9800, 17/365, .05, .348652), 2), 129.71)

        # `cpp_operations_call` function
        f.cpp_operations_call()

    def _check_value_in_range(self, value, lower_limit, upper_limit):
        """
        Check if a value is in a provided range.

        Args:
            value (double): The value to check.
            lower_limit (double): The lower limit tolerance for the value.
            upper_limit (double): The upper limit tolerance for the value.

        Returns:
            bool: True if the value is in the provided range.
        """
        return lower_limit <= value <= upper_limit

if __name__ == '__main__':
    unittest.main()
