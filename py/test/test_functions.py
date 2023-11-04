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

# This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
# warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

# You should have received a copy of the GNU Affero General Public License along with this program. If not, see
# <https:www.gnu.org/licenses/>.

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + '/../..') # add the project root path

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
        
        # `plot_variability` function
        f.plot_variability('AAPL')

        # `cpp_operations_call` function
        f.cpp_operations_call()

if __name__ == '__main__':
    unittest.main()
