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

        # `bs_call` function
        self.assertEqual(round(f.bs_call(10218, 9800, 17/365, .05, .348652), 2), 570.50)
        
        # `bs_put` function
        self.assertEqual(round(f.bs_put(10218, 9800, 17/365, .05, .348652), 2), 129.71)
        
        # `stock_price_variability` function
        res = f.stock_price_variability('AAPL', [ImplementationMethod.Python, ImplementationMethod.Cpp], hide_plot=True)
        
        # Python implementation for the calculation
        python_res_dict = res[ImplementationMethod.Python]
        python_res_dict_first_key = next(iter(python_res_dict.keys()))
        self.assertEqual(python_res_dict_first_key.strftime("%Y-%m-%d %H:%M:%S"), '2010-01-04 00:00:00')
        python_res_dict_last_key = next(reversed(python_res_dict.keys()))
        self.assertEqual(python_res_dict_last_key.strftime("%Y-%m-%d %H:%M:%S"), '2020-09-30 00:00:00')
        python_res_dict_values = python_res_dict.values()
        # print([item for item in python_res_dict_values][:50])
        # Only keep the numerical and non-NaN values
        filtered_python_res_dict_values = [item for item in python_res_dict_values 
            if isinstance(item, (int, float)) and not math.isnan(item)]
        self.assertEqual(round(sum(filtered_python_res_dict_values), 2), 688.36)

        # C++ implementation for the calculation
        cpp_res_dict = res[ImplementationMethod.Cpp]
        cpp_res_dict_first_key = next(iter(cpp_res_dict.keys()))
        self.assertEqual(cpp_res_dict_first_key.strftime("%Y-%m-%d %H:%M:%S"), '2010-01-04 00:00:00')
        cpp_res_dict_last_key = next(reversed(cpp_res_dict.keys()))
        self.assertEqual(cpp_res_dict_last_key.strftime("%Y-%m-%d %H:%M:%S"), '2020-09-30 00:00:00')
        cpp_res_dict_values = cpp_res_dict.values()
        # print([item for item in cpp_res_dict_values][:50])
        # Only keep the numerical and non-NaN values
        filtered_cpp_res_dict_values = [item for item in cpp_res_dict_values 
            if isinstance(item, (int, float)) and not math.isnan(item)]
        self.assertEqual(round(sum(filtered_cpp_res_dict_values), 2), 670.76)

        # `cpp_operations_call` function
        f.cpp_operations_call()

if __name__ == '__main__':
    unittest.main()
