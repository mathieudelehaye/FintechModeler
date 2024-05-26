#
# app_launcher.py
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


import os
import sys

sys.path.append(
    os.path.dirname(os.path.abspath(__file__)) + "/../.."
)  # add the project root path

from datetime import datetime
from dateutil.relativedelta import relativedelta
from scripts.functions import ImplementationMethod

import math
import scripts.functions as f
import unittest


class AppLauncher:
    """ Class to launch the fintech modeler."""

    def run(self):
        """
        Run all the functions from the modeler.

        TODO:
            - Split this unique `all` method into different ones.
        """

        # `stock_price_variability` function. E.g.: 'AV.L' for Aviva LSE, 'AAPL'
        # for Apple NYSE
        variabilities = f.stock_price_variability(
            "AAPL",
            [ImplementationMethod.Python, ImplementationMethod.Cpp],
            hide_plot=True,
        )

        # start_date = datetime.today() - relativedelta(months=6)
        # end_date = datetime.today() - relativedelta(days=2)
        variability_lower_limit = 0
        variability_upper_limit = 100

        python_variabilty = variabilities[ImplementationMethod.Python]
        self.__assertTrue(
            self.__check_value_in_range(
                python_variabilty, variability_lower_limit, variability_upper_limit
            ),
            f"Value {python_variabilty} is not in the specified range "
            "[{variability_lower_limit}, {variability_upper_limit}]",
        )

        cpp_variabilty = variabilities[ImplementationMethod.Cpp]
        self.__assertTrue(
            self.__check_value_in_range(
                cpp_variabilty, variability_lower_limit, variability_upper_limit
            ),
            f"Value {cpp_variabilty} is not in the specified range "
            "[{variability_lower_limit}, {variability_upper_limit}]",
        )

        # `bs_call` function
        # stock_price=186.4
        stock_price = 188.01
        # expiration_days=5
        expiration_days = 2
        interest_rate = 0.0525
        variability = python_variabilty

        print(f"Strike\tStock\tExp. [d]\tCall")
        # strike_prices=[180,182.5,185,187.5,190,192.5]
        strike_prices = [182.5, 185, 187.5, 190, 192.5, 195]
        for strike_price in strike_prices:
            call_price = round(
                f.bs_call(
                    stock_price,
                    strike_price,
                    expiration_days / 365,
                    interest_rate,
                    variability,
                ),
                2,
            )
            print(f"{strike_price}\t{stock_price}\t{expiration_days}\t{call_price}")

        # `bs_put` function
        self.__assertEqual(
            round(f.bs_put(10218, 9800, 17 / 365, 0.05, 0.348652), 2), 129.71
        )

        # `cpp_operations_call` function
        f.cpp_operations_call()

    def __check_value_in_range(self, value, lower_limit, upper_limit):
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

    def __assertTrue(self, condition, message="Assertion failed"):
        """
        Asserts that the given condition is True. If the condition is False, an AssertionError is raised.

        Parameters:
            condition (bool): The condition to be checked.
            message (str, optional): The error message to be displayed if the condition is False. Defaults to "Assertion failed".

        Raises:
            AssertionError: If the condition is False.

        Returns:
            None
        """
        if not condition:
            raise AssertionError(f"{message}: `{condition}` isn't True")

    def __assertEqual(self, first, second, message="Assertion failed"):
        """
        Asserts that the two given values are equal. If the values are not equal, an AssertionError is raised.

        Parameters:
            first (object): The first value to be compared.
            second (object): The second value to be compared.
            message (str, optional): The error message to be displayed if the values are not equal. Defaults to "Assertion failed".

        Raises:
            AssertionError: If the values are not equal.

        Returns:
            None
        """
        if first != second:
            raise AssertionError(f"{message}: `{first}` != `{second}`")

