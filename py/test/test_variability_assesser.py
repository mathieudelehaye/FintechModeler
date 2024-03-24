#
# test_variability_assesser.py
#
# Created by Mathieu Delehaye on 24/03/2024.
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
import tempfile
import unittest

from scripts.variability_assesser import VariabilityAssesser


class TestVariabilityAssesser(unittest.TestCase):
    """Test case for the VariabilityAssesser class."""

    def setUp(self):
        """
        Set up method to run prior to each test.
        """
        self.assesser = VariabilityAssesser('AAPL')
        self.variabilities = []

    def tearDown(self):
        """
        Tear down method to run after each test.
        """
        del self.assesser

    def test_read_words_from_not_existing_file(self):
        """Test for word reading from a not existing text file."""
        try:
            VariabilityAssesser("AAPL")
            self.fail("The previous instructions should have raised an exception.")
        except FileNotFoundError:
            return


if __name__ == "__main__":
    unittest.main()
