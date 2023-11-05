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
        attribute_1 (str): This is the description of attribute_1.
    """

    def plot_variability(self, stock_name, hide_plot=False):
        """
        Compute and plot the rolling variability, based on the Yahoo 
        Finance data of the `pandas-datareader` library.

        Args:
            stock_name (str): The name of the stock for which the price
                variability must be plot.
            hide_plot (bool, optional): Set to True to hide the plot, 
                e.g. for unit-testing the method. 
        
        Returns:
            int: This is the description of the return value.
        """

        # There is a type issue, due to a change in Yahoo Finance API. It needs
        # a workaround: https://stackoverflow.com/questions/74832296
        yf.pdr_override() 

        symbols = [ stock_name ]
        start_date = datetime(2010,1,1)    
        end_date = datetime(2020,10,1) 
        data = pdr.get_data_yahoo(symbols, start=start_date, end=end_date)

        print(data.head(10))

        data['change'] = data['Adj Close'].pct_change()
        data['rolling_sigma'] = data['change'].rolling(20).std() * np.sqrt(255)

        print(f"mean: {data['rolling_sigma'].mean()}")
        print(f"std: {data['rolling_sigma'].std()}")

        if not hide_plot:
            data['rolling_sigma'].plot()
            
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
