#
# test_variability_assesser.py
#
# Created by Mathieu Delehaye on 24/03/2024.
#
# FintechModeler: A Python and C++ library for fintech modeling.
#
# Copyright © 2024 Mathieu Delehaye. All rights reserved.
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

from scripts.functions import ImplementationMethod
from scripts.variability_assesser import VariabilityAssesser

import scripts.functions as f

import os
import random
import tempfile
import unittest


class TestVariabilityAssesser(unittest.TestCase):
    """Test case for the VariabilityAssesser class."""

    def test_read_stock_price(self):
        """Test for reading the stock prices from Yahoo Finance."""
        
        assesser = VariabilityAssesser("AAPL")
        assesser.read_stock_price(1)
        self.assertGreater(len(assesser.stock_prices()), 0)

        stock_price_indices = assesser.stock_prices().index.tolist()
        self.assertGreater(len(stock_price_indices), 0)

        adjusted_closing_stock_prices = assesser.stock_prices()["Adj Close"].tolist()
        self.assertGreater(adjusted_closing_stock_prices[-1], 0)

    def test_compute_variability(self):
        """Test for calculating the variability for stock prices."""
        
        assesser = VariabilityAssesser("MSFT")
        assesser.read_stock_price(1)
        self.assertGreater(len(assesser.stock_prices()), 0)

        self.assertGreater(assesser.compute_variability(), 0)

        variabilities = assesser.variability_dict()
        self.assertEqual(len(variabilities), len(assesser.stock_prices()))
        self.assertGreater(variabilities[list(variabilities.keys())[-1]], 0)
    
    def test_compute_variability(self):
        """Test for calculating the variability for stock prices."""
        
        assesser = VariabilityAssesser("AMZN")
        assesser.read_stock_price(1)
        self.assertGreater(len(assesser.stock_prices()), 0)

        variabilities_to_import = [random.random() for _ in range(0, len(assesser.stock_prices()))]
        assesser.import_variability(variabilities_to_import)

        imported_variabilities = assesser.variability_dict()
        self.assertEqual(len(imported_variabilities), len(variabilities_to_import))
        self.assertEqual(sum(imported_variabilities.values()), sum(variabilities_to_import))


if __name__ == "__main__":
    unittest.main()
