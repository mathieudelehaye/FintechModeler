#pragma once

/*
 * statistics_calculator.h
 *
 * Created by Mathieu Delehaye on 4/11/2023.
 *
 * FintechModeler: A Python and C++ library for fintech modeling.
 *
 * Copyright � 2023 Mathieu Delehaye. All rights reserved.
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

#include <vector>

 /**
  * Class for calculating statistics on a stochastic variable.
  */
class StatisticsCalculator {
public:
    /**
     * Constructor
     */
    StatisticsCalculator();

    /**
     * Add a data point to the dataset.
     *
     * @param value The data point to be added.
     */
    void addData(double value);

    /**
     * Clear the dataset.
     */
    void clearData();

    /**
     * Set the dataset vector items from a C-style array.
     *
     * @param value The data point for setting the vector.
     */
    void setDataFromArray(const double arr[], int length);

    /**
     * Convert the dataset vector to a relative difference array:
     *  dataset[i] = (dataset[i] - dataset[i-1])/dataset[i-1]
     */
    void convertToRelativeChanges();

    /**
     * Set the rolling window subset from the complete dataset.
     *
     * DO NOT forget to call this method, otherwise the calculation
     * methods on a rolling window will return 0.
     *
     * @param windowStartIndex The index in the complete dataset
     *  where the window starts.
     * @param windowLength The length of the window.
     */
    void setRollingWindow(
        int windowStartIndex,
        int windowLength
    );

    /**
     * Calculate the mean (average) of the dataset
     * from a rolling window.
     *
     * @return The mean value on the window.
     */
    double calculateRollingMean() const;

    /**
     * Calculate the standard deviation of the dataset
     * from a rolling window.
     *
     * @return The standard deviation on the window.
     */
    double calculateRollingStandardDeviation() const;

private:
    /**
     * @brief The complete set of data.
     *
     * The complete set of data from which the rolling window will be built.
     */
    std::vector<double> completeData;

    /**
    * @brief The rolling window data.
    *
    * The subset of data from the current rolling window.
    */
    std::vector<double> dataWindow;
};
