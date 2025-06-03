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

#include "statistics_calculator.h"

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

    // std::cout<<"StatisticsCalculator::setDataFromArray: length="<<length<<std::endl;
    // for (int i = 0; i < completeData.size(); i++) {
    //     std::cout<<"StatisticsCalculator::setDataFromArray: completeData[i]="<<completeData[i]<<std::endl;
    // }
}

void StatisticsCalculator::convertToRelativeChanges() {
    double previousItem=0;
    double currentItem=0;

    for (std::vector<double>::iterator it = completeData.begin(); it != completeData.end(); ++it) {
        currentItem = *it;
        
        if (it == completeData.begin()) {
            *it = 0;    
        } else {
            *it = (currentItem - previousItem) / previousItem;
        }

        previousItem = currentItem;
    }

    // for (int i = 0; i < completeData.size(); i++) {
    //     std::cout<<"StatisticsCalculator::convertToRelativeChanges: completeData[i]="<<completeData[i]<<std::endl;
    // }
}

void StatisticsCalculator::setRollingWindow(
    int windowStartIndex,
    int windowLength
) {
    if (completeData.empty() ||
        (windowStartIndex + windowLength) > completeData.size()) {

        return; 
    }

    dataWindow.clear(); // Clear existing rolling window
    dataWindow.reserve(windowLength);

    // Define iterators for the start and end of the subset
    const std::vector<double>::iterator start = completeData.begin() + windowStartIndex;
    const std::vector<double>::iterator end = start + windowLength;

    for (std::vector<double>::iterator it = start; it != end; ++it) {
        dataWindow.push_back(*it);
    }

    // std::cout<<"StatisticsCalculator::setRollingWindow: dataWindow.size()="<<dataWindow.size()<<std::endl;
    // for (int i = 0; i < dataWindow.size(); i++) {
    //     std::cout<<"StatisticsCalculator::setRollingWindow: dataWindow[i]="<<dataWindow[i]<<std::endl;
    // }
}

double StatisticsCalculator::calculateRollingMean() const {
    if (completeData.empty() || 
        dataWindow.empty()) {

        return 0.0;
    }

    double sum = 0.0;
    for (const double& value : dataWindow) {
        sum += value;
    }
    
    return sum / dataWindow.size();
}

double StatisticsCalculator::calculateRollingStandardDeviation() const {
    if (completeData.empty() || 
        dataWindow.empty()) {

        return 0.0;
    }

    const double mean = calculateRollingMean();

    double sumSquaredDifferences = 0.0;
    for (const double& value : dataWindow) {
        const double difference = value - mean;
        sumSquaredDifferences += difference * difference;
    }

    const double variance = sumSquaredDifferences / dataWindow.size();
    const double sigma = std::sqrt(variance);

    return sigma;
}
