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

from datetime import datetime
from pandas_datareader import data as pdr

import matplotlib.pyplot as plt
import numpy as np
import yfinance as yf

class VariabilityAssesser:
    """
    A class helping assess the variability of a stock price.

    Attributes:
        _stock_name (str): The name of the stock for which the 
            price variability must be computed.
        _stock_prices (array): An indexed array, which contains the 
        stock price data. Read the array description below. 
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

    def get_stock_prices(self):
        """
        Getter for the stock prices.
        
        Returns:
            An indexed array, which contains the stock price data. The row indices
            are of `datetime` type and the column values are double (except when 
            noted).
            
            Date (index)   Open      High       Low     Close  Adj Close      Volume [int]
            ------------------------------------------------------------------------------
            2010-01-04  7.622500  7.660714  7.585000  7.643214   6.487534   493729600
            ...
        """
        return self._stock_prices

    def get_variabilities(self):
        """
        Getter for the stock price variabilities.
        
        Returns:
            An indexed array, which contains the stock price variabilities. The row indices
            are of `datetime` type and the column values are double.
            
            Date (index)   Variability
            --------------------------
            2010-01-04         NaN
            ...
            2010-02-02      0.364328
        """
        return self._stock_prices['rolling_sigma']

    def read_stock_prices(self, slice_size=0):
        """
        Read the underlying stock prices from the Yahoo Finance 
        data of the `pandas-datareader` library.
        Those prices will be used to compute the variability.

        Args:
            slice_size (optional, int): if greater than 0, sample a slice
                of the `slice_size` first data rows, and replace the data 
                array with it.
        """
        
        # There is a type issue, due to a change in Yahoo Finance API. It needs
        # a workaround: https://stackoverflow.com/questions/74832296
        yf.pdr_override() 

        symbols = [ self._stock_name ]
        start_date = datetime(2010,1,1)    
        end_date = datetime(2020,10,1) 
        self._stock_prices = pdr.get_data_yahoo(symbols, start=start_date, end=end_date)
        # print(self._stock_prices.head(10))

        if (slice_size > 0):
            # keep a slice with the first `slice_size` rows
            end_index_number=slice_size-1
            end_index_name=self._stock_prices.index[end_index_number]
            self._stock_prices=self._stock_prices.loc[:end_index_name]
        
        # print(self._stock_prices)

    def compute_variability(self):
        """
        Compute the rolling variability and add it to the stock price data.
        """

        self._stock_prices['change'] = self._stock_prices['Adj Close'].pct_change()
        self._stock_prices['rolling_sigma'] = self._stock_prices['change'].rolling(20).std() * np.sqrt(255)

        # print(f"mean: {self._stock_prices['rolling_sigma'].mean()}")
        # print(f"std: {self._stock_prices['rolling_sigma'].std()}")
        # print(self._stock_prices['rolling_sigma'].head(50))

    def plot_variability(self):
        """
        Plot the rolling variability.
        
        Args:
            hide_plot (bool, optional): Set to True to hide the plot, 
                e.g. for unit-testing the method. 
        
        Returns:
            int: This is the description of the return value.
        """
        
        self._stock_prices['rolling_sigma'].plot()
            
        plt.ylabel('$\sigma$')
        plt.title('AAPL Stock Price Historical Volatility')

        # Connect the event handler to the click event
        cid = plt.gcf().canvas.mpl_connect('button_press_event', self._on_plot_click)

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
