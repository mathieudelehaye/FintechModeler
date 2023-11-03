# 
# Functions.kt
# 
# Created by Mathieu Delehaye on 1/11/2023.
# 
# FintechModeler: A library for fintech modeling.
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

from datetime import datetime
from pandas_datareader import data as pdr
from scipy.stats import norm
import matplotlib.pyplot as plt
import numpy as np
import yfinance as yf

N = norm.cdf

def bs_call(S, K, T, r, sigma):
    """
    Calculate the value of a call option.

    :param S: the underlying asset current price 
    :param K: the strike price 
    :param T: the expiration [year]
    :param r: the risk-free interest rate
    :param sigma: the underlying asset price variability
    :return: the option price
    """
    d1 = (np.log(S/K) + (r + sigma**2/2)*T) / (sigma*np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    return S * N(d1) - K * np.exp(-r*T)* N(d2)

def bs_put(S, K, T, r, sigma):
    """
    Calculate the value of a put option.

    :param S: the underlying asset current price
    :param K: the strike price 
    :param T: the expiration [year]
    :param r: the risk-free interest rate
    :param sigma: the underlying asset price variability
    :return: the option price
    """
    d1 = (np.log(S/K) + (r + sigma**2/2)*T) / (sigma*np.sqrt(T))
    d2 = d1 - sigma* np.sqrt(T)
    return K*np.exp(-r*T)*N(-d2) - S*N(-d1)

def plot_variability():
    # There is a type issue, due to a change in Yahoo Finance API. It needs
    # a workaround: https://stackoverflow.com/questions/74832296/typeerror-string-indices-must-be-integers-when-getting-data-of-a-stock-from-y
    yf.pdr_override() 

    symbols = ['AAPL']
    start_date = datetime(2010,1,1)    
    end_date = datetime(2020,10,1) 
    data = pdr.get_data_yahoo(symbols, start=start_date, end=end_date)

    print(data.head(10))

    data['change'] = data['Adj Close'].pct_change()
    data['rolling_sigma'] = data['change'].rolling(20).std() * np.sqrt(255)

    print(f"mean: {data['rolling_sigma'].mean()}")
    print(f"std: {data['rolling_sigma'].std()}")

    data['rolling_sigma'].plot()
    
    plt.ylabel('$\sigma$')
    plt.title('AAPL Rolling Volatility')
    plt.show()