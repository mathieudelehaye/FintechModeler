#
# variability_assesser.py
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
from dateutil.relativedelta import relativedelta

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import yfinance as yf


class VariabilityAssesser:
    """
    A class helping assess the variability of a stock price.

    Attributes:
        _stock_name (str): The name of the stock for which the
            price variability must be computed.
        _stock_prices (pandas.DataFrame): An object which contains the
            stock price data. Read the array description below.
        _variabilities (pandas.DataFrame): An object which contains the
            computed rolling variabilities.
    """

    def __init__(self, stock_name):
        """
        Constructor.

        Args:
            stock_name (str): The name of the stock for which the
                price variability must be computed.
        """
        self._stock_name = stock_name
        self._stock_prices = []
        self._variabilities = []

    def get_stock_prices(self):
        """
        Getter for the stock prices.

        Returns:
            pandas.DataFrame: an object which contains the stock price data. The row
            indices are of `datetime` type and the column values are of float type
            (except when noted).

            Date (index)   Open      High       Low     Close  Adj Close      Volume [int]
            ------------------------------------------------------------------------------
            2010-01-04  7.622500  7.660714  7.585000  7.643214   6.487534   493729600
            ...
        """
        return self._stock_prices

    def get_variability_dict(self):
        """
        Getter for the stock price variabilities as an array.

        Returns:
            dict:
                - The key is of `datetime` type and represents the variability date.
                - The value is of float type and represents the variability.
        """
        # print(f"VariabilityAssesser.get_variability_dict: self._variabilities=\n{self._variabilities}")

        return dict(zip(self._variabilities.index, self._variabilities["Variability"]))

    def import_variability(self, values):
        """
        Setter for the stock price variabilities.

        Args:
            values (list): a list with the rolling variabilities.

        Returns:
            bool: True if the values were correctly written.
        """

        self._variabilities["Variability"] = values[
            : len(self._variabilities["Variability"])
        ]
        # print(f"VariabilityAssesser.import_variability: self._variabilities=\n{self._variabilities}")

        return True

    def read_stock_price(self, start_month=6, end_month=0):
        """
        Read the underlying stock prices from the Yahoo Finance
        data of the `pandas-datareader` library.
        Those prices will be used to compute the variability.

        Args:
            start_month (optional, int): start date for the price samples,
                as a number of months backwards. E.g.: 6 means the first
                sample is taken 6 months in the past from today's date.
                Default value: 6.

            end_month (optional, int): end date for the price samples,
                as a number of months backwards. E.g.: 1 means the last
                sample is taken 1 month in the past from today's date.
                Default value: 0.
        """

        start_date = datetime.today() - relativedelta(months=start_month)
        end_date = datetime.today() - relativedelta(months=end_month)
        end_date = datetime.today()

        ticker = yf.Ticker(self._stock_name)
        self._stock_prices = ticker.history(start=start_date, end=end_date)

        # Prepare the empty variability dataframe
        indices = self._stock_prices.index.tolist()
        self._variabilities = pd.DataFrame(
            [0] * len(indices), columns=["Variability"], index=indices
        )
        # print(f"VariabilityAssesser.read_stock_price: self._variabilities=\n{self._variabilities}")

    def compute_variability(self):
        """
        Compute the rolling variabilities.

        Returns:
            float: the mean over all the rolling variabilities.
        """

        self._stock_prices["Rel Change"] = self._stock_prices["Adj Close"].pct_change()
        print(
            f"VariabilityAssesser.compute_variability: self._stock_prices=\n{self._stock_prices}"
        )

        self._variabilities["Variability"] = self._stock_prices["Rel Change"].rolling(
            20
        ).std() * np.sqrt(255)

        res = self._variabilities["Variability"].mean()
        print(f"VariabilityAssesser.compute_variability: mean: {res}")
        print(
            f"VariabilityAssesser.compute_variability: std: {self._variabilities['Variability'].std()}"
        )
        print(
            f"VariabilityAssesser.compute_variability: self._variabilities.loc[20:]=\n{self._variabilities[20:]}"
        )

        return res

    def plot_variability(self):
        """
        Plot the rolling variability.
        """
        print(
            f"VariabilityAssesser.plot_variability: self._variabilities=\n{self._variabilities}"
        )

        self._variabilities.plot()

        plt.ylabel("$\\sigma$")
        plt.title("AAPL Stock Price Historical Volatility")

        # Connect the event handler to the click event
        cid = plt.gcf().canvas.mpl_connect("button_press_event", self._on_plot_click)

        plt.show()

    def _on_plot_click(self, event):
        """
        Close the current plot windows on a mouse-click event on it.

        Args:
            event (obj): The intercepted event.

        TODO:
            - Derive `matplotlib.pyplot` to encapsulate the click-event handling method.
        """

        if event.inaxes is not None:
            # Close the plot window when clicked
            plt.close()
