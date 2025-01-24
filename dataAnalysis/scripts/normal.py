#
# normal.py
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

import numpy as np
import matplotlib.pyplot as plt

# Set the mean and standard deviation for the Gaussian distribution
mean = 50
std_dev = 15

# Generate X, i.e. 1000 random integers following a Gaussian distribution
random_integers = np.random.normal(loc=mean, scale=std_dev, size=10000).astype(int)

# Clip the values to ensure they are within the desired range (0 to 100)
random_integers = np.clip(random_integers, 0, 100)

# Calculate the mean
random_integers_mean = np.mean(random_integers)
print(f"mean={random_integers_mean}")

# Calculate the squared deviations from the mean (SDM)
random_integers_sdm = (random_integers - random_integers_mean) ** 2
print(f"sdm={random_integers_sdm}")

# Calculate the variance
random_integers_variance = np.mean(random_integers_sdm)
print(f"variance={random_integers_variance}")

# Calculate the standard deviation or sigma
random_integers_sigma = np.sqrt(random_integers_variance)
print(f"sigma={random_integers_sigma}")

# Create a histogram of X
plt.hist(random_integers, bins=100, density=True, alpha=0.6, color="b")

plt.xlabel("Value")
plt.ylabel("Frequency")
plt.title("Histogram of Random Integers (Gaussian Distribution)")

plt.show()

# Create a histogram of sdm(X)
plt.hist(random_integers_sdm, bins=100, density=True, alpha=0.6, color="b")
plt.title("Histogram of Random Integer SDM (Gaussian Distribution)")
plt.show()
