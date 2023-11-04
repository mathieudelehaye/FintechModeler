/*
 * statistics_calculator.cpp
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

#include <cmath>
#include <iostream>
#include <vector>

#include <statistics_calculator.h>

StatisticsCalculator::StatisticsCalculator() {}

void StatisticsCalculator::addData(double value) {
    completeData.push_back(value);
}

void StatisticsCalculator::clearData() {
    completeData.clear();
}

void StatisticsCalculator::setDataFromArray(const double arr[], int length) {
    completeData.clear(); // Clear existing data
    completeData.reserve(length);

    for (int i = 0; i < length; i++) {
        completeData.push_back(arr[i]);
    }
}

void StatisticsCalculator::setRollingWindow(
    int windowStartIndex,
    int windowLength
) {
    if (completeData.empty() ||
        (windowStartIndex + windowLength) > completeData.size()) {

        return; 
    }

    // Define iterators for the start and end of the subset
    const std::vector<double>::const_iterator start = completeData.begin() + windowStartIndex;
    const std::vector<double>::const_iterator end = completeData.begin() + windowLength;

    if (dataWindow != nullptr) {
        delete dataWindow;
    }

    // Create a new vector containing the subset
    dataWindow = new std::vector<double>(start, end);
}

double StatisticsCalculator::calculateRollingMean() const {
    if (completeData.empty() || 
        dataWindow == nullptr) {

        return 0.0;
    }

    double sum = 0.0;
    for (const double& value : *dataWindow) {
        sum += value;
    }
    
    return sum / dataWindow->size();
}

double StatisticsCalculator::calculateRollingStandardDeviation() const {
    if (completeData.empty() || 
        dataWindow == nullptr) {

        return 0.0;
    }

    double mean = calculateRollingMean();
    double sumSquaredDifferences = 0.0;

    for (const double& value : *dataWindow) {
        double difference = value - mean;
        sumSquaredDifferences += difference * difference;
    }

    double variance = sumSquaredDifferences / dataWindow->size();
    return std::sqrt(variance);
}
