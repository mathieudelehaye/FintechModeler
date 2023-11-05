/*
 * operations.cpp
 *
 * Created by Mathieu Delehaye on 4/11/2023.
 *
 * FintechModeler: A Python and C++ library for fintech modeling.
 *
 * Copyright © 2023 Mathieu Delehaye. All rights reserved.
 *
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General
 * Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with this program. If not, see
 * <https://www.gnu.org/licenses/>.
 */

#include <iostream>
#include <statistics_calculator.h>

extern "C" {
    /*
     * Function: add_integers
     * ----------------------
     * Adds two integers and returns the result.
     *
     * a: The first integer to be added.
     * b: The second integer to be added.
     *
     * Returns: The sum of 'a' and 'b'.
     */
    int add_integers(int a, int b) {
        return a + b;
    }

    /*
     * Function: compute_variability
     * -----------------------------
     * Compute the variability of stock prices provided as an input.
     *
     * stock_prices: The input array with the stock prices.
     * variabilities: The output array with the computed variabilities.
     * array_length: The input and output array size.
     */
    double compute_variability(const double stock_prices[], int array_length) {
        // std::cout<<"compute_variability: array_length="<<array_length<<std::endl;
        // for (int i = 0; i < array_length; i++) {
        //     std::cout<<"compute_variability: stock_prices[i]="<<stock_prices[i]<<std::endl;
        // }
        
        const auto calculator = new StatisticsCalculator();

        calculator->setDataFromArray(stock_prices, array_length);

        const int rollingWindowSize = 3;
        for(int i = 0; (i + rollingWindowSize) <= array_length; i++) {
            calculator->setRollingWindow(i, rollingWindowSize);

            const double res = calculator->calculateRollingStandardDeviation();
            
            std::cout<<"compute_variability: res="<<res<<std::endl;
        }


        delete calculator;

        return 0;
    }
}
